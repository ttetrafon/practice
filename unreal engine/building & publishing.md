# Building a Game

## Optimise Graphic Settings

- _Settings -> Engine Scalability Setting_
  - Selecting _Auto_ will have the game detect the running machine's capability and adjust these settings depending on its findings.

## Build

### Define Settings

- _Edit -> Project Settings_
  - _Description_
  - _Maps & Modes_
  - _Windows_ (or other appropriate target system)
  - _Packaging_

### Package

- Click _Platforms -> Windows_ (or other appropriate target system).
- Select location to create the build.
- Navigate to the _WindowsNoEditor_ folder to find the executable.

#### Additional Non-Asset Directories

- In _Project Settings -> Packaging -> Advanced_ four (lists of) directories can be defined to be included in the packaged version of the game.

## Distributing a Game

### Essentials & Code

A copy of the essential files can be obtained through _Project -> Zip Project_, which creates a compressed files with all custom, required files currently in the project.
