# Submodules (Nested Repositories)

- [submodule git docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Git Submodules: Adding, Using, Removing, Updating](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)

## Adding a Submodule

- `git submodule add git@host:repository path/to/subfolder`
- If a submodule has submodules of its own, it needs to be initialised so that all repos are cloned properly.
  - `git submodule init`
  - `git submodule update`

## Updating a Submodule

- In VSCode (Windows), the git extension tracks the submodules as separate repositories, allowing for normal work with them.

## Removing a Submodule

- Removing a submodule needs to be done manually.
  - Remove the path created for the submodule (`git rm --cached path/to/subfolder`).
  - Remove the subfolder it resides.
  - Remove the appropriate lines from **.gitmodules**.
