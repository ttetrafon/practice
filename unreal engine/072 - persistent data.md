# Persistent Data

- Links:
  - [The ultimate guide | How to Save & Load your unreal engine 5 game | ue5](https://www.youtube.com/watch?v=H6rqJbwjRIk)
  - [Exploring Game Saves: JSON Basics in Unreal | Game Dev Tutorial](https://www.youtube.com/watch?v=SUKZlIDGF6w)
- Gameplay data can be saved on the disk so a player can continue their game at a later time, after restarting the application.

## Operations

### Saving Data

- Create the data structures (or any other serialisable variable) to be saved within the `SaveGame` blueprint; all variables must be marked as **serialisable**.
  - When storing complex objects, references must be set as *class references*.
- In a controller (usually the Game Instance, Game State, or Player Controller), create a variable to hold a reference to the `SaveGame` blueprint (object reference) created above.
  - If a reference is not stored, use the `Create Save Game Object` to create an instance, and then store it in the reference above.
- Create a variable (string) to hold the saved game's slot name.
- Set the variable values from the game state into the save game object.
- Use the `(Async) Save Game to Slot` node to save the data.
  - Use async when doing save operations during gameplay.
  - In the slot name, paths can be used to create subfolders in the save game folder. For example, *slot = player1/settings/general_settings- will create the path **./player1/settings/general_settings.sav**.
- Regardless of the save system employed in the game (player's choice, checkpoints, autosaves, continuous, etc), because the data that need to be saved are all over the place, a good practice is to use interfaces and hold the data to be saved in the Game Instance until the time they will be saved.

### Loading Data

- Check if the save game exists by using the `Does Save Game Exist` node with the appropriate slot name.
- If it exists, use `(Async) Load Game from Slot`.
  - Async loading is useful during level streaming or similar situations.
- Cast the result into the appropriate `SaveGame` blueprint by using the `Cast to` node.
  - When loading a class reference, check it with `Is Valid Class` before using it.
- Store the resulting blueprint in the reference slot created before.
- Use the data from the blueprint to update state variables.

### Deleting Data

- Check if the save game exists by using the `Does Save Game Exist` node with the appropriate slot name.
- Use the `Delete Game in Slot` node to remove the specific save game.

## Location

- Save data location depends on the system:
  - Any (dev): in the project folder
  - Windows (prod): ...
  - Linux (prod): ...
- `Make File Path` can be used to define the file to be saved.
- Specific system folders can be access through:
  - `Get Project Content Directory / FPaths::ProjectDir()`: the game folder itself
  - `Get Saved Directory / FPaths::ProjectSavedDir()`:
  - `Get Config Directory / FPaths::ProjectConfigDir()`:
  - `Get Persistent Download / FPaths::ProjectPersistentDownloadDir()`:

### Subdirectories

- Generally, `Make File Path` does not create subfolders, thus operations using that will fail (silently) if the target folder does not exist.
- To create subfolders, the `IPlatformFile` needs to be used (in C++), which can then be exposed in blueprints.

```C++
UFUNCTION(BlueprintCallable, Category = "File Utilities")
static bool CreateDirectory(const FString& DirectoryPath);

// ---------------------------------------------------------------------------

bool UMyFileUtilities::CreateDirectory(const FString& DirectoryPath)
{
  IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();

  if (!PlatformFile.DirectoryExists(*DirectoryPath))
  {
    return PlatformFile.CreateDirectory(*DirectoryPath);
  }

  return true; // Directory already exists
}
```

## Save Game Data

### Data Structure

- For efficiency, each save slot should be a folder, and in it multiple save files, each one for different type of data.
- It is generally good practice to create structures for each type of save file.

### Data Types

#### SAV

- The default save file format is binary (.sav).

#### JSON

- For ease of use and access data can be saved in Json format.
- Json manipulation requires the **Json Blueprint Utilities** and **Serialization Utils** plugins to be activated.
- Useful nodes:
  - `Convert Structure to Json String` and `Load Json from String`
  - `Save Json to File`
    - Note that this does not create folders, if the target folder is missing the operation fails.
  - `Load Json from File`
  - `Get Field Names`

### Versioning

- A good practice is to keep the game version in the save files.
  - Older versions should be handled when loaded to avoid issues.
  - In some cases, it is useful to immediately update older version save files to the newest ones after being handled.
