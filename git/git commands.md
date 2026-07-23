# git

## Setup

```git
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

## Use

### Initialisation

- `init` starts a repository.
  - `git init`: Initiate a git repository within the current, non-empty folder.
  - `git init project_name`: Initialise an empty git repository in the "current folder/project_name".
  - `git init file/path/project_name`: Initialise an empty git repository in the specified folder.
- `clone`
  - `git clone source_URL destination_folder`: Make a local clone of a remote repository.
    - Creates automatically a connection to the remote repository.

### Filtering

- `.gitignore` stores a list of rules for automatically ignored files and folders.
  - `name`: All files and folders starting with "name".
  - `*.ext`: All files of the with the specified extension.

### Repository Controls

- `remote`
  - git remote: Shows the original repository, plus any other associated repositories.
  - git remote add remote_name remote_URL: Connects a remote repository with the specified name to the current repository.
  - git remote rm remote_name: Remove a remote repository connection.
  - git pull remote-name branch-name: Pulls all changes in the branch from the remote repository.
  - git push remote-name branch-name: Pushes all changes in the branch to the remote repository.

### Status

- `git status`: returns the current status of the repository.
- `diff` returns a line by line edit of the file.
  - **+**: Added line.
  - **-**: Removed line.
  - **@@**: Changed line.
  - `git diff filename`
  - `git diff directory`
  - `git diff filename`
  - `git diff -r HEAD~#`
    - **-r**: Compared to a specific revision.
    - **HEAD~#**: The #th revision.
  - `git diff -r HEAD path/to/file`
    - **HEAD**: The most recent revision.
  - `git diff ID1..ID2`
    - **ID#**: A commit's hash.
  - `git diff branch1..branch2`
- `git show hash`
  - **hash** requires only the first 6 to 10 letters of the hash string.
- `git show -r HEAD`
- `git show -r HEAD~#`
- `git annotate filename`

### Commit

- `add` starts tracking files in the git repository.
  - `git add .`
    - **.**: Adds all untracked files.
  - `git add filename`
- `commit` makes commits the current changes.
  - `git commit`
  - `git commit -m "message"`
    - **-m**: Appends the "message" automatically.
- `log` returns all the changes.
  - **q** exits the log at any time.
  - `git log`
  - `git log path/filename`
- `git clean -n`
  - **-n**: Shows files being tracked but also in .gitignore.
- `git clean -f`
  - **-f**: Removes the files that appear in .gitignore completely, both from the disk and from tracking.
- `git remove file_name`: Removes the indicated file from the tracking list.
- `reset` reverts previous commits
  - `git reset HEAD filename/directory`: Un-stages the file/folder.
  - `git reset HEAD~1`: Un-commits the last commit but keeps the changes.
  - `git reset HEAD~1 --hard`: Un-commits the last commit and removes all changes.

```git
<!-- Do not keep changes -->
git reset --hard #commit-hash#
git push --force
```

```git
<!-- Keep changes -->
git reset --soft #commit-hash#
git add --all
git stash
git push --force
git stash pop
```

### Branch Controls

- `branch`
  - `git branch`: Shows the number of branches and the current one.
- `checkout`
  - `git checkout -- filename(s)/directory`: Discards any changes since the last commit to the specified files/folders.
  - `git checkout hash filename(s)/directory`: As above, but restores the file as committed in the specified revision (by hash).
  - `git checkout branch_name`: Switch to the indicated branch.
  - `git checkout -b branch_name`: Create a new branch and switch to it.
- `merge`
  - `git merge source_branch destination_branch`: Merge the source branch with the destination branch.

### Temporary Changes

- `stash` holds temporary changes.
  - `git stash list`: Lists all stashed changes.
  - `git stash drop "stash@{#}"`: Destroys the specified stash.
  - `git stash pop "stash@{#}"`: Gets the stashed changes back into the working copy and destroys that stash.
  - `git stash apply "stash@{#}"`: Gets the stashed changes back into the working copy and keeps that stash.
  - `git stash`: Stashes all changes. Untracked files are ignored, unless staged.
  - `git stash -p`

### Patches

- You can create stash as patch file from one machine, then can share that patch file to another machines.
  - The `stash@{0}` is the ref of the stash. It will create patch file with latest stash.
  - If you want different one use command `git stash list` to see your list of stashes and select which one you want to patch.

```git
git stash show "stash@{0}" -p > changes.patch
```

- Now transfer that stash to another machine and paste it into the root folder of your project.

```git
git apply changes.patch
```

- If there is mistake and you want to reverse the change

```git
git apply changes.patch --reverse
```
