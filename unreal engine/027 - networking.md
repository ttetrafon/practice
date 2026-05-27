# Networking

- Links:
  - [https://www.youtube.com/playlist?list=PLNb7FZ2Nw2HTcJ9Qvy8n2Ou-ZVbsDOMFh](https://www.youtube.com/playlist?list=PLNb7FZ2Nw2HTcJ9Qvy8n2Ou-ZVbsDOMFh)

- Star model, meaning there is a server and players connected to it.
- Communication between clients always happens through the server.
- Two types of server:
  - listen: acts as a player and server simultaneously
  - dedicated: acts only as the server and does not feature a player controller

## Online Subsystem

- At the bottom of Unreal's multiplayer lies the [Online Subsystem](https://dev.epicgames.com/documentation/en-us/unreal-engine/online-subsystem-in-unreal-engine?application_version=5.4).

## Basic Setup

- Multiplayer resolves around *sessions*.
  - `Create Session`: (do not pass a *player controller* for a dedicated server)
    - Following a create session, must come an `Open Level`, with the option of *listen*.
    - *Public Connections* is the maximum number of players allowed to connect to the session.
  - `Find Sessions`
  - `Join Session`
    - Only handle the *failure* output - on a *success* Unreal automatically loads the session's level
  - `Destroy Session`: Terminates the session. For the clients, does it for themselves only, for the host, terminates it for all connected clients. Again, it needs to be followed by an `Open Level`, which determines where
- Info on the session is provided through the `Get Server Name` (the Steam/Epic username, or PC name for a local session), `Get Current Players`, `Get Max Players`, and `Get Ping in Ms` nodes.
- These nodes can only be used in the `Game Instance` or the `Player Controller`, they will fail anywhere else.
- In C++ `#include "Net/UnrealNetwork.h"`.

## Editor Setup

Multiple instances of the game can be run automatically in the same editor.

- **Editor Preferences -> Level Editor -> Play**
  - **Game Viewport Settings -> New Viewport Resolution -> adjust for 2 instances to run side by side**
  - **Play Options**
    - **Number of Players -> 2 (or more...)**

## Players

- Multiple PlayerControllers are created in a multiplayer game - one for each player.
  - Any `Actor` directly assigned to a `Pawn` is automatically associated with that pawn's owner (PlayerController).
  - All player controllers are created in the server, while each client has only its owned player controller spawn.
  - To allow only relevant processes to run, use `Is Local Player Controller`.
- Each player needs their own dedicated *player start* point, unless multiple players start on the same starting point.
  - When having multiple player starts, override `ChoosePlayerStart` function inside the `GameMode`. (a simple way is to use the `Player Start Tag`, set it to *Used* when a player start has been used, and later loop over all of them until one not used is found).
- `Is Locally Controlled` can be used to prevent events and/or processes from happening wherever they should be.
  - *For example, a **character**'s `begin play` will run in all instances of a multiplayer game, meaning that the same process will be triggered multiple times, although each client needs to only run their own character's begin play process.*

## Replication

- **Actor Relevancy** determines which actors in the game world should be replicated to which clients based on their current locations, and which actors are relevant to the player's current view/area. The actor's relevancy is determine by the following checks, in order:
  1. If **bAlwaysRelevant = true**, is owned by the Pawn or PlayerController, is the Pawn object, or the Pawn is the instigator of an action concerning the actor, it is relevant.
  2. If the actor has **bNetUseOwnerRelevancy = true** and the actor itself has an owner, the owner's relevancy will be used.
  3. If the actor has **bOnlyRelevantToOwner = true** and it does not pass the 1st check, then it is not relevant.
  4. If the actor is attached to another actor's skeleton, then relevancy is determined by its parent.
  5. If the actor has **bHidden = true** and the root component is not colliding with the checking actor, then the actor is not relevant.
  6. If **AGameNetworkManager** is set to use *distance-based* relevancy, the actor is relevant if it is closer than the culling distance.
- **Actors** in a scene can be replicated over multiplayer (`Class Details -> Replication = True, Replicate Movement = True`).
  - Any class deriving from `APawn` or `ACharacter` has `bReplicates = true` as a default value.
- **Variables/Properties** can also be replicated (`(Variable) Details -> Replication -> Replicated`).
  - During initialisation, there may be a delay for variables to be replicated, as this will be done on the next replication cycle. To avoid this, have such variables only be created on the server.
    - Can be done by creating the value in a server class (e.g.: `Game Mode`).
    - Can also be done by checking with `Is Server` and aborting creation on clients.
  - For clients to set replicated variables, RPCs must be used, or the replication type must be set to `Details -> Replication -> Replicated/RepNotify` and then `Set w/Notify` used to update them.
    - When set on `RepNotify`, a blueprint function will be created (`OnRep_veriable_name`). This function will be then called every time the variable is updated over the network.
    - `RepNotify` is also triggered out of time when a client connects to the server, even if the change of value has happened much earlier.
  - **Net Cull Distance**, **Net Update Frequency** (has a real-life max of 60???), and **Min Net Update Frequency** are useful to control how much effort the server has to do for these specific variables.
  - **C++** variables can be replicated with the use of `UPROPERTY(Replicated)`.
    - In addition, must add the following function inside the class employing the replicated variable.

```c++
UPROPERTY(Replicated)
int32 score;
```

- A callback can be defined for when a property's value is updated through the network.
  - The callback method, or at least a wrapper for it, must be defined in the same class with the property.

```c++
UPROPERTY(ReplicatedUsing="OnRep_Score")
int32 score;
```

```c++
UFUNCTION()
void OnRep_Score()
```

- All replicated properties must be declared within the `AActor::GetLifetimeReplicatedProps()` function by using the `DOREPLIFETIME()` macro.
  - A property registered for replication cannot be unregistered later during the runtime.
  - By using the `DOREPLIFETIME_CONDITION()` instead, properties can only replicate under specified conditions, either predefined (`COND_OwnerOnly`) or defined in the code (with `DOREPLIFETIME_ACTIVE_OVERRIDE()`).

```c++
void My_Class_Type::GetLifetimeReplicatedProps(TArray<FLifetimeProperty> &OutLifetimeProps) const {
  Super::GetLifetimeReplicatedProps(&OutLifetimeProps);
  DOREPLIFETIME(My_Class_Type, My_Replicated_Variable);
}
```

- Anything supposed to be replicated is assigned a priority value, which will determine the order of the replication when the network bandwidth is limited.
- Network **Actors** can be referenced (in the code) only if they are set up for networking.
  - A replicated actor or component, can be replicated as a reference.
  - Non-replicated actors and components need to be **stably named** (Stably named means that the actor has the same name in both server and client. This usually happens if the actor has not been spawned during gameplay but was loaded directly in the level from a package) in order to be replicated as references.

## Authority

- Authority refers to which instance of the game has the final say on the game state. The concept of authority ensures game state consistency over all clients.
  - Usually the server has authority over game mechanics like player movement, damage calculation, and so on.
  - When a client requests to perform an action, the server calculates its validity, updates the game state accordingly, and then informs all connected clients about the change.
- Actors can be locally or remotely controlled, which determines who has authority in each case. Locally controlled characters have authority over their actions, while the server holds authority on remotely controlled ones.
  - The **Role** and **Remote Role** actor properties provide information about authority and replication. Possible roles are:
    - ROLE_Authority: The running instance has authoritative control over the actor.
    - ROLE_AutonomousProxy: The running instance is an autonomous proxy of the actor.
      - When an actor is controlled by a *PlayerController*, `Role = ROLE_AutonomousProxy` may be used, so that despite the server having authority, predictions will occur based on player input to limit erratic behaviour over the network.
    - ROLE_SimulatedProxy: The running instance is a locally simulated proxy of the actor.
      - This can be used so movement and other actions are predicted locally so that server updates do not end up in erratic behaviour.
    - ROLE_None: The role is irrelevant.
  - Regardless of the role selected, clients will never replicate actors to servers. This means that only the server will have `Role = ROLE_Authority` and `RemoteRole = ROLE_AutonomousProxy/ROLE_SimulatedProxy`.

## Remote Procedural Calls (RPC)

- RPCs are used for multiplayer clients to perform server-side only actions.
- There are three types of RPCs in unreal:
  - **Server**: Called by an object on a client but is executed only on the server version of the same object. The client must own the object that triggers the call for this to work.
  - **Client**: Called on the server by an object but executed only on the client version that owns the object calling it.
  - **NetMulticast**: Can be called on the server by an object and executed both on the server and all client versions of the object calling it. If called by a client, only the local client will execute it.

```c++
UFUNCTION(Client)
void DoSomething_Client()

UFUNCTION(Server)
void DoSomething_Server()
```

- Custom events can be used for this purpose, by setting them as `Details -> Replicates -> Run on Server`.
  - `Reliable` requires the actor on which the PRC is called on to be owned by a client, and will be processed in order of calling.
    - *Reliable RPCs should be avoided in the tick method or in input bindings, as they may cause an overflow of the network queue causing issues in the networking performance.*
  - For events that need to happen on all clients, but do not really need to be perfectly replicated (like particle effects), an event needs to be set as `Details -> Replicates -> Multicast`.
    - A multicast RPC must be called on the server specifically, otherwise it will run only on the client it has been called. So, a multicast needs to be set as a child of a server RPC.
- Client RPCs will be called from the server and run only on the specified client.
  - To make a client's RPC replicate to the server (and other clients), create an extra custom event [`Details -> Replicates -> Run on Server`] to call the final event [`Details -> Replicates -> Multicast`].
    - e.g.: You want to change a material on a character with the click of a button. It will be set up like this:
      1. OnClick -> Server_RPC
      2. Server_PRC -> Client_RPC
    - *This setup is also needed for anything that is not replicated automatically, like the `Play Anim Montage` blueprint.*
- RPCs in C++ cannot be BlueprintCallable, but can be wrapped in BlueprintCallable functions.
  - First, the function must be declared, and then a secondary, '_Implementation' functions needs to be declared and defined with the RPC's code.

```c++
UFUNCTION(Server, Reliable)
  void TestServerRPC_CPP();
void TestServerRPC_CPP_Implementation();
```

```c++
void TestServerRPC_CPP_Implementation() {
  // ... do stuff here!
}
```

- The RPC UFUNCTION can also use the parameter `WithValidation`. For this an extra function needs to be declared and defined.
  - Validation is used so that RPCs are never executed with bad input/data.
  - The result of this function determines if the _*Implementation()* will run or not.

```c++
bool TestServerRPC_CPP_Validate() {
  // ... validate here!
  if (failure) {
    return false;
  }
  return true;
}
```
