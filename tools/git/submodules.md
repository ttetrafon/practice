# Submodules (Nested Repositories)

- [submodule git docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Git Submodules: Adding, Using, Removing, Updating](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)

## Use

- `git submodule status` provides information about current submodule state

### Initialising

- If a repository includes submodules, run `git submodule update --init --recursive` to initialise them.
  - ... or `git submodule add --force git@github.com:submodule-repo.git path/to/submodule`

### Adding a Submodule

- `git submodule add git@host:repository path/to/subfolder`
- If a submodule has submodules of its own, it needs to be initialised so that all repos are cloned properly.
  - `git submodule init`
  - `git submodule update`

### Updating a Submodule

- In VSCode (Windows), the git extension tracks the submodules as separate repositories, allowing for normal work with them.

### Removing a Submodule

- Removing a submodule needs to be done manually.
  - Remove the path from within the .git directory (`.git/modules/...`).
  - Remove the subfolder it resides.
  - Run `git config --unset-all "submodule.path/to/subfolder"`
  - Remove the appropriate lines from **.gitmodules**.

## Local Setup

- Sometimes gitmodules can be requested over `https://` instead of `git@`.
- To keep using the key when using the submodules, add a global rule to convert https to git.

```bash
git config --global url."git@github.com:".insteadOf "https://github.com/"
```
