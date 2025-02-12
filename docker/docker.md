# Docker

- Links:
  - [Dive Into Docker](https://diveintodocker.com/ref-dfp)
  - [Docker Crash Course for Absolute Beginners](https://www.youtube.com/watch?v=pg19Z8LL06w)
  - [Ultimate Docker Compose Tutorial](https://www.youtube.com/watch?v=SXwC9fSwct8)
  - [Using Images, Dockerfiles, and Docker Compose](https://containers.dev/guide/dockerfile)
  - [How to Connect Docker Compose Services To Each Other](https://erik-ekberg.medium.com/docker-compose-connecting-services-by-hostname-or-alias-b4f1a53d8d95)
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
  - To interact with a private repository, `docker login` is needed (depends on the specific registry).
  - To store an image on a registry, first build it locally.
  - Then push it in the registry with `docker push REGISTRY_NAME/IMAGE_NAME:TAG`.
- To download an image:

```bash
docker pull IMAGE_NAME:TAG
```

- Run an image with the command `docker run`.
  - If the image has not already been downloaded, docker will run `pull` on its own.
  - `-d` runs the container detached from the parent terminal.
    - When running detached, logs can be retrieved through `docker logs CONTAINER_ID`.
  - `--name` can be used to determine the container's name. *Useful for referencing the container later.*
  - `-e ENVIRONMENT_VARIABLE=VALUE` defines an environment variable on the container.
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

- A docker network helps containers on the same environment to communicate with each other and with the external world.

```bash
docker network create NETWORK_NAME
```

- `docker network ls`
- When running a container, we can add it to a network with `--network NETWORK_NAME`.
- `docker rm RESOURCE_NAME/RESOURCE_ID` deletes the specified resource (image, container, network, etc).
- All stopped containers can be removed with `docker container prune`.

```bash
docker stats
```

### Clean-up

```bash
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
docker system prune
docker system prune -af
```

## Docker Files

- A docker file is a set of instructions (docker & bash commands) for creating an image.
  - Each instruction (line) is called a layer, and is used as a change delta compared to the previous layer.
- Must (generally) start with a base image (`FROM image:tag`), which will be modified to our liking.
- Application source files are then copied (`COPY source_dir destination_dir`).
- Then we ask to install dependencies and/or to build source files (`RUN ...`).
- We can change where the commands are being run with `WORKDIR selected_directory`.
- Environment variables are set with `ENV env_name env_value`.
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

## Docker Compose

- [Docker Compose documentation](https://docs.docker.com/compose/)
- Tool to define and run multi-container applications in a single environment.
- Uses a single *compose.yaml* file to create configurations for multiple containers and deploys all simultaneously.
- When a compose file is run, a docker network is created automatically and all services are added to it.
  - Communication between containers can be done by referencing the container names.
    - URLs are resolved as `http://{{service-name}}:{{listening-port}}/`.
  - Alternatively, a custom docker network can be created within the composer file.
- `depends_on` can be used to defer initialisation of a container after its dependencies are up and running.
- `build` can be used to point to a dockerfile, replacing a prebuilt image with one built at the time of deployment.
- For secrets, it's better to [secrets](https://docs.docker.com/compose/use-secrets/).

```yaml
services:
  mongodb:
    image: mongo
    ports:
      - 27017:27017 # host:container
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=some_password
  mongo-express:
    image: mongo-express
    ports:
      - 8081:8081
    environment:
      - MONGO_CONFIG_MONGODB_ADMINUSERNAME=admin
      - MONGO_CONFIG_MONGODB_ADMINPASSWORD=some_password
      - MONGO_CONFIG_MONGODB_SERVER=mongodb
    depends_on:
      - mongodb
  webapp:
    build: ./path/to/dockerfile
    ports:
      - 3000:3000
    environment:
      - MONGODB_ADMINUSERNAME=admin
      - MONGODB_ADMINPASSWORD=some_password
      - MONGODB_SERVER=mongodb
    depends_on:
      - mongodb
```

- `docker compose -f compose.yaml` is the base command for running the configuration found in *compose.yaml*.
  - `up -d` builds and starts everything.
  - `up --force-recreate --build -d` rebuilds and starts everything.
  - `down` stops the full system and removes all resources.
  - `start/stop` starts or stops all services.
  - `--project-name NAME` replaces the default resource prefix (folder name) with the specified one.
- Images can also be grabbed from private repositories (`image: REGISTRY_NAME/IMAGE_NAME:TAG`), but you need to be logged in appropriate registry to succeed.
