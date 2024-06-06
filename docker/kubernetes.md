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
- **Service (svc)**: A service is a static IP address that can be attached to each pod.
  - Services are either *internal* (default, `http://service-ip:port`) or *external* (`http://node-ip:port`), which means they can be accessed only from within the cluster in the first case or from the outside too in the later.
  - **Ingress(ing)**: Operates an an *https endpoint* (`http://my-app.com`) for an external service.
  - A service operates as a load balancer, directing requests to whichever pod is least busy.
- **ConfigMap (cm)**: Stores application configuration externally to the applications themselves (e.g.: `BD_URL = mongo-db-service`).
  - Each config map is connected to a specific pod, which can then retrieve and use the configuration.
  - **Secret**: Used for confidential configuration properties, like passwords and API keys.
    - Values in a secret must be base64 encoded and not in plain text.
    - [Secrets are not encrypted by default though](https://kubernetes.io/docs/concepts/configuration/secret/), so encryption must be enabled in some way or another.
- **Volume (vol)**: Volumes are used to keep persistent data (data stored in a DB, logs, etc).
  - A volume attaches a physical storage device on a pod.
  - The storage device can be either on the local or on a remote machine.
  - A volume is always external to the cluster itself, even when it lives on the same machine with the cluster.
- **Deployment (deploy)**: In the deployment component, pod blueprints are defined alongside rules for deployment (replicas, resources, etc).
  - In essence, a deployment is an abstraction on top of a pod.
  - Deployments are used only for stateless components (e.g.: web-app).
- **StatefulSet (sts)**: Just like a deployment, but for stateful pods (e.g.: DB).

### Configuration

- All configuration goes through the API Server (within a master node).
- Each component has its own configuration (can be a single file for each component).
- Configuration files can be either in *.yaml* or in *.json* format.
- A configuration file has three parts, (1) *metadata*, (2) *specification*, and (3) *status*.
  - The *specification* region has entries related to the specific component.
  - The *status* is generated automatically and added by k8s itself.
- **labels** are used to allow finding replicas running the same stuff; they do not provide uniqueness.
  - **matchLabels** determines which deployments include which pods.

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: CM
  namespace: default
data:
  key: default
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name:  MYAPP
  namespace: default
  labels:
    app:  MYAPP
spec:
  selector:
    matchLabels:
      app: MYAPP
  replicas: 1
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app:  MYAPP
    spec:
      # initContainers:
        # Init containers are exactly like regular containers, except:
          # - Init containers always run to completion.
          # - Each init container must complete successfully before the next one starts.
      containers:
      - name:  MYAPP
        image:  MYAPP:latest
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
          limits:
            cpu: 100m
            memory: 100Mi
        livenessProbe:
          tcpSocket:
            port: 80
          initialDelaySeconds: 5
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /_status/healthz
            port: 80
          initialDelaySeconds: 5
          timeoutSeconds: 2
          successThreshold: 1
          failureThreshold: 3
          periodSeconds: 10
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: MYAPP
              key: DB_HOST
        ports:
        - containerPort:  9345
          name:  MYAPP
        volumeMounts:
        - name: localtime
          mountPath: /etc/localtime
      volumes:
        - name: localtime
          hostPath:
            path: /usr/share/zoneinfo/Asia/Shanghai
      restartPolicy: Always
---
apiVersion: v1
kind: Service
metadata:
  name: MYAPP
  namespace: default
spec:
  selector:
    app: MYAPP
  type: NodePort
  sessionAffinity: None
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
  ports:
  - name: MYAPP
    protocol: TCP
    port: 8080
    targetPort: 9345
    nodePort: 30303
```

## K8s Systems

- [kubectl](https://kubernetes.io/docs/reference/kubectl/)
- [Minicube](https://minikube.sigs.k8s.io/docs/)
- [K3d](https://k3d.io/)

### kubectl

- CLI (is also installed with Docker Desktop) tool to interact with a cluster.
- Create stuff in the cluster:
  - `kubectl apply -f FILENAME.yaml` deploys a configuration file.
  - Resources referenced elsewhere (ConfigMaps, Secrets, DBs, etc) need to be applied before anything that references them.
- Get info on stuff on the cluster:
  - `kubectl get pod/configmap/secret/svc/services`
    - `-o wide` gives more info.
  - `kubectl describe POD_NAME/POD_ID`
  - `kubectl logs POD_NAME/POD_ID`
    - `-f` streams the logs.

### Minikube

- Links:
  - [Docs](https://minikube.sigs.k8s.io/docs/)
- Installs a single node that can host a full cluster on a single machine; useful for testing.
- First, install minikube and add it to path.
- `minikube start` starts minikube on the system.
  - `--driver DRIVER` can be used to select between *docker*, hyperv, ssh, etc drivers to run minikube on.
  - `--v=7 --alsologtosderr` enabled debug logging
- `minikube status`
- `minikube stop`
- `minikube ip` returns the cluster's IP address which can be used to access services on the cluster.
- `minikube delete`

#### Deploying on Minikube

#### Watching Minikube

- `kubectl proxy` starts an access proxy for the cluster (must be left alive in the terminal).
  - Use `curl http://localhost:8001/version` to check if the proxy is running!
- When the proxy is running, the cluster's API server automatically creates an endpoint for each pod.
