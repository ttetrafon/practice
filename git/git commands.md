# git

## Setup

```git
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

## History

```git
gitk --follow [filename]
```

### Remove History

#### Do not keep changes

```git
git reset --hard #commit-hash#
git push --force
```

#### Keep changes

```git
git reset --soft #commit-hash#
git add --all
git stash
git push --force
git stash pop
```
