# Docker

- Links:
  - [Dive Into Docker](https://diveintodocker.com/ref-dfp)
  - [Docker Crash Course for Absolute Beginners](https://www.youtube.com/watch?v=pg19Z8LL06w)
- Virtualisation software, helps with developing and deploying applications exactly in the same way within a team and along different systems.
  - Packages the application with all necessary dependencies, configuration, system tools, and runtime in a **Docker Image**, ensuring it always operates the same.
  - Running an image on docker service creates a **container** based on that image.
    - One image can spawn multiple containers, as needed.

## Setup

### Windows

If docker complains about WSL version, update it to the latest version.

```powershell
wsl.exe --update
```

## Use

- To list local images:

```bash
docker images
```

- To list local containers:
  - `-a` includes stopped containers also.

```bash
docker ps
```

- To find community images, look into [Docker Hub](https://hub.docker.com/).
- Instead of the public registry (Docker Hub), images can be uploaded and retrieved from private registries (e.g.: AWS ECR, Google Container Registry, Nexus, ...).
- To download an image:

```bash
docker pull IMAGE_NAME:TAG
```

- Run an image with the command `docker run`.
  - If the image has not already been downloaded, docker will run `pull` on its own.
  - `-d` runs the container detached from the parent terminal.
    - When running detached, logs can be retrieved through `docker logs CONTAINER_ID`.
  - `--name` can be used to determine the container's name.
- Stopping a container is done through `docker stop CONTAINER_ID`.
- A stopped container can be restarted with `docker start CONTAINER_ID`.
- *All commands can use CONTAINER_NAME in place of CONTAINER_ID*.

```bash
docker run IMAGE_NAME:TAG
```

- Containers can be exposed on the local network through *port binding*.
  - `run -p HOST_PORT:CONTAINER_PORT` binds the CONTAINER_PORT (the one defined in the application itself) to the HOST_PORT, which is then exposed and thus becomes accessible to the local network.
  - Each HOST_PORT can only be bound to a single application CONTAINER_PORT.

```bash
# The following binds and exposes nginx's port 80 to localhost:9000.
docker run -d -p 9000:80 nginx:1.23
```

## Docker Files

- A docker file is a set of instructions (docker & bash commands) for creating an image.
  - Each instruction (line) is called a layer, and is used as a change delta compared to the previous layer.
- Must (generally) start with a base image (`FROM image:tag`), which will be modified to our liking.
- Application source files are then copied (`COPY source_dir destination_dir`).
- Then we ask to install dependencies and/or to build source files (`RUN ...`).
- We can change where the commands are being run with `WORKDIR selected_directory`
- The last command is often `CMD [params]`, which will start the application itself.

*For example, for a node express server (files located in ./src/, package.json in ./), we will use the following Dockerfile:*

```Dockerfile
FROM node:19-alpine
COPY package.json /app/package.json
WORKDIR /app
RUN npm install
COPY src /app/
CMD ["node", "server.js"]
```

- `docker build -t NAME:TAG /path/to/dockerfile` uses the Dockerfile to build the image.
  - The image can then be either used locally or uploaded to a registry to be used elsewhere.
