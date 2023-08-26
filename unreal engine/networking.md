# Networking

- Star model, meaning there is a server and players connected to it.
- Communication between clients always happens through the server.
- Two types of server:
  - listen: acts as a player and server simultaneously
  - dedicated: acts only as the server and does not feature a player controller

## Basic Setup

- Multiplayer resolves around _sessions_.
  - `Create Session`: (do not pass a _player controller_ for a dedicated server]
    - Following a create session, must come an `Open Level`, with the option of `listen`.
  - `Find Sessions`
  - `Join Session`
- These nodes can only be used in the `Game Instance` or the `Player Controller`, they will fail anywhere else.
- In C++ `#include "Net/UnrealNetwork.h"`.

## Editor Setup

Multiple instances of the game can be run automatically in the same editor.

- **Editor Preferences -> Level Editor -> Play**
  - **Game Viewport Settings -> New Viewport Resolution -> adjust for 2 instances to run side by side**
  - **Play Options**
    - **Number of Players -> 2 (or more...)**

## Replication

- **Actors** in a scene can be replicated over multiplayer (`Class Details -> Replication`).
- **Variables** can also be replicated (`(Variable) Details -> Replication -> Replicated`).
  - During initialisation, there may be a delay for variables to be replicated, as this will be done on the next replication cycle. To avoid this, have such variables only be created on the server.
    - Can be done by creating the value in a server class (e.g.: `Game Mode`).
    - Can also be done by checking with `Is Server` and aborting creation on clients.
  - For clients to set replicated variables, RPCs must be used, or the replication type must be set to `Details -> Replication -> RepNotify` and then `Set w/Notify` used to update them.
  - **C++** variables can be replicated with the use of `UPROPERTY(Replicated)`.
    - In addition, must add the following function inside the class employing the replicated variable.

```
void My_Type::GetLifetimeReplicatedProps(TArray<FLifetimeProperty> &OutLifetimeProps) const {
  Super::GetLifetimeReplicatedProps(&OutLifetimeProps);
  DOREPLIFETIME(My_Type, My_Replicated_Variable);
}
```

## Remote Procedural Calls (RPC)

- RPCs are used for multiplayer clients to perform server side only actions.
- Custom events can be used for this purpose, by setting them as `Details -> Replicates -> Run on Server`.
  - `Reliable` requires the actor on which the PRC is called on must be owned by a client, and will be processed in order of calling.
- For events that need to happen on all clients, but do not really need to be perfectly replicated (like particle effects), an event needs to be set as `Details -> Replicates -> Multicast`.
  - A multicast RPC must be called on the server specifically, otherwise it will run only on the client it has been called. So, a multicast needs to be set as a child of a server RPC.
- Client RPCs will be called from the server and run only on the specified client.

### C++
- RPCs in C++ cannot be BlueprintCallable, but can be wrapped in BlueprintCallable functions.
- First, the function must be declared, and then a secondary, '_implementation' functions needs to be declared and defined with the RPC's code.

```
UFUNCTION(Server, Reliable)
  void TestServerRPC_CPP();
void TestServerRPC_CPP_Implementation();
```

```
void TestServerRPC_CPP_Implementation() {
  // ... do stuff here!
}
```

- The RPC UFUNCTION can also use the parameter `WithValidation`. For this an extra function needs to be declared and defined.
- The result of this function determines if the *_implementation()* will run or not.

```
bool TestServerRPC_CPP_Validate() {
  // ... validate here!
}
```
