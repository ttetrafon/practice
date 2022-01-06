# Installation

1. Install nodejs (https://nodejs.org/en/download/) and test (`npm version`).
2. Install angular-cli (`npm install -g @angular/cli`) and test (`ng version`).

# Project Creation

1. Navigate to the project's parent folder.
2. Run `ng new project-name` and follow the prompts.

# Libraries

## Creation

1. Create a new project, or navigate to an existing one.
2. Create a new library (`ng generate library library-name`).
3. Libraries can be found within the `projects` folder, and should be marked with `"projectType": "library"` in `Angular.json`.
4. The `public-api.ts` is the entry to the library.
5. Add a scope to the library's name (`@username\library-name`). This is done so that each component in the npm library has a unique name.

## Build and Publish
1. Navigate to the root of the project that holds the library.
2. Run `ng build library-name`. You can add `--watch` to build have it built automatically as you make changes in the source code.
3. Create/Login to your npm account, and login in VSCode (`npm login`).
4. Navigate to the library's folder (at the same level with its `package.json`).
5. Publish to npm with `npm publish --access=public`; "public" is required because components with a scope are private by default.

## Include
To include your library download it as all other libraries from npm (`npm install --save library-name`).

