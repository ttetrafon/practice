# Plugins & Libraries

## Use of Plugins

- Plugins come in various forms:
  - Functional plugins are added on the game engine.
    - These need to be activated through the _Edit -> Plugins_ menu.
  - Asset plugins are added on a project.
  - Project plugins are the base of new projects.
- Plugins are available in the marketplace, and can be added/installed in the _library tab_ in the _Epic App_.
- For loose plugins copy the packaged plugin in `./Plugins`.
  - In addition to the above, for C++ projects, add the plugin in _./Source/ProjectName/ProjectName.Build.cs_, in the string array `PublicDependencyModuleNames.AddRange()`.

```
PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "CustomLoosePlugin" });
```

## Building Plugins

- _Edit -> Plugins -> Add_
  - ...
- A new plugin needs to be included in the game.
- All content should go inside the plugin's folder which has been created within the game contents. Everything in there will be packaged and served as a plugin.
  - For C++ classes select the plugin in their creation window.
  - Also, make sure to include all appropriate engine imports in the `ThePlugin.Build.cs` file.
- To export a plugin, use _Edit -> Plugins -> Other -> ThePlugin -> package_.

## Use of Libraries

- Third party libraries can be used by wrapping them inside an unreal engine plugin (**Third Party Library**).
- Extra libraries must be included in the *PluginName.Build.cs*, in the `PublicAdditionalLibraries.Add(Path.Combine(ModuleDirectory, "x64", "Release", custom_library.lib));`
- The library must then be added as an `include` in the `WrapperPlugin.h` file, and then functionality must be translated to support unreal objects (e.g.: std::string -> FString);

### Creating a Third Party Static Library

- In Visual Studio, *new project -> static library*, and put the project inside the plugin folder with the example library.
- The implementation file requires `include "pch.h"`, and the PCH.h file must import the library's header file.
- The library needs to be build for release.
