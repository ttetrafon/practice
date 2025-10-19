# Unreal Version Upgrade

## Good Practices

- Minimise engine code changes.
  - Put the code in plugins whenever possible.
  - Derive from unreal classes instead of modifying.
- Rethink/re-plan changes if merging looks like will be messy.
- Make engine changes toggleable if possible.
  - `#if` does not work with `UPROPERTY()` though, or similar macros.

```cpp
// In build.h:
#define SOME_ENGINE_CHANGE_TOGGLE (1)

// In the actual code:
#if SOME_ENGINE_CHANGE_TOGGLE
  // ... the code for the change
#endif
```

- When replacing code, keep the original code in the `#else` block for the toggle, so one can easily see if epic updated that part of the code.

```cpp
#if CUSTOM_CODE_REPLACE
  // new code
#else
  // original code
#endif
```

## Upgrading

- Create a copy of the project and create a new upgrade branch.
- Build the editor.
  - .build editor
- Update code/plugins for changed and/or new APIs.
  - "fix" all deprecation warnings
  - update code for local engine changes incrementally, if they were toggleable
- Open the editor and fix errors/warnings.
  - use `Map Check` to identify asset issues
  - try to `PIE` when the editor opens without cleanly
  - resave all assets by running the appropriate commandlets
    - [no-world-partition] -run=resavepackages -autocheckout -batchsourcecontrol
    - [with-world-partition] -run=WorldPartitionBuilderCommandlet -Builder=WorldPartitionResaveActorsBuilder
- Cook the game in all platforms and fix errors as needed.
