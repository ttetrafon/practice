# Kubernetes

- Links:
  - [Kubernetes Crash Course for Absolute Beginners](https://www.youtube.com/watch?v=s_o8dwzRlu4)
- A container orchestration tool.
- Helps manage containerised applications in all types of environments (physical machines, virtual machines, hybrid setups, ...).
- As an orchestration tool, kubernetes provides the following benefits:
  - High availability / No downtime
  - Scalability / High performance
  - Disaster Recover / Backup & Restore

## Architecture

- **Control Plane**: A (master) node sits on top.
  - Various management processes run on the control plane.
  - Examples of such processes:
    - **API Server**: The control plane acts as the entry point for the cluster (UI, API, CLI, and so on).
    - **Controller Manager**: Keeps track of the worker nodes.
    - **Scheduler**: Ensures pod placement based on the workload and available resources.
    - **etcd**: The k8s backing store holds the current state of the cluster at all times, as well as snapshots of the worker nodes to facilitate backup recovery.
  - In production environments, it is usually better to keep to master nodes running for availability reasons.
- **(Worker) Nodes**: Under the control plane, nodes running a *kubelet* process each are invoked.
  - The kubelet processes are what allow the kubernetes' cluster parts to communicate with each other internally.
  - Each node has a different number of docker containers running within, depending on the current requirements.

### K8s Components

- **Cluster**: A group of control and worker nodes that all together form a full stack program.
- **Virtual Network**: A cluster defines its own private virtual network to facilitate and secure communications between its components.
- **Node**: A node is a virtual or physical machine.
- **Pod**: A pod is an abstraction over a container. It creates a layer on top of the container, so that the container becomes part of the cluster.
  - Usually it's better to have a single app inside each pod (e.g.: a server, a db, etc).
  - Pods are ephemeral, and they can be stopped/destroyed for various reasons.
  - Each pod has its own *IP* within the cluster. However, a new IP address is assigned to the pod if it is recreated/restarted for any reason.
- **Service (svg)**: A service is a static IP address that can be attached to each pod.
  - Services are either *internal* (default, `http://service-ip:port`) or *external* (`http://node-ip:port`), which means they can be accessed only from within the cluster in the first case or from the outside too in the later.
  - **Ingress(ing)**: Operates an an *https endpoint* (`http://my-app.com`) for an external service.
  - A service operates as a load balancer, directing requests to whichever pod is least busy.
- **ConfigMap (cm)**: Stores application configuration externally to the applications themselves (e.g.: `BD_URL = mongo-db-service`).
  - Each config map is connected to a specific pod, which can then retrieve and use the configuration.
  - **Secret**: Used for confidential configuration properties, like passwords and API keys. [Secrets are not encrypted by default though](https://kubernetes.io/docs/concepts/configuration/secret/), so encryption must be enabled in some way or another.
- **Volume (vol)**: Volumes are used to keep persistent data (data stored in a DB, logs, etc).
  - A volume attaches a physical storage device on a pod.
  - The storage device can be either on the local or on a remote machine.
  - A volume is always external to the cluster itself, even when it lives on the same machine with the cluster.
- **Deployment (deploy)**: In the deployment component, pod blueprints are defined alongside rules for deployment (replicas, resources, etc).
  - In essence, a deployment is an abstraction on top of a pod.
  - Deployments are used only for stateless components (e.g.: web-app).
- **StatefulSet (sts)**: Just like a deployment, but for stateful pods (e.g.: DB).
