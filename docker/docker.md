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

- To list images and containers:

```bash
docker images
docker ps
```

- To find community images, look into [Docker Hub](https://hub.docker.com/).
- To download an image:

```bash
docker pull IMAGE_NAME:TAG
```

- To run an image:
  - If the image has not already been downloaded, docker will run `pull` on its own.
  - `-d` runs the container detached from the parent terminal.
  - When running detached, logs can be retrieved through `docker logs CONTAINER_ID`.

```bash
docker run IMAGE_NAME:TAG
```
