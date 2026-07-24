# Dev

## NodeJs

```bash
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install node-lts
nvm install node
```

To check if nvm is installed:

```bash
command -v nvm
```

To check all currently installed versions of node:

```bash
nvm ls
```

To change the version of Node.js you would like to use for a project, create a new project directory `mkdir NodeTest`, and enter the directory `cd NodeTest`, then enter `nvm use node` to switch to the Current version, or `nvm use --lts` to switch to the LTS version. You can also use the specific number for any additional versions you've installed, like `nvm use v8.2.1` (To list all of the versions of Node.js available, use the command: `nvm ls-remote`).
