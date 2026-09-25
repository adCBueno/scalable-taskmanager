# Task manager

A task manager built with React, Bootstrap, TypeScript, Express, and MongoDB.

Stacks:

- UI/: React frontend + Bootstrap.
- web-gateway/: serves the frontend and forwards API requests.
- task-service/: validates requests and reads or writes tasks in MongoDB.
- k8s/: Deployments, Services, and MongoDB StatefulSet with persistent storage.
- compose.yaml: runs the three services together.

## Architecture

<img width="853" height="122" alt="image" src="https://github.com/user-attachments/assets/9f49af81-5b04-43fc-b9ac-88d619e3b217" />

## Commands

Note: this project requires Docker Desktop with Kubernetes enabled

```powershell
kubectl --context docker-desktop get storageclass
kubectl --context docker-desktop apply -f k8s/mongo.yaml
kubectl --context docker-desktop rollout status statefulset/mongo -n taskmanager-learning --timeout=180s
kubectl --context docker-desktop apply -f k8s/task-service.yaml
kubectl --context docker-desktop rollout status deployment/task-service -n taskmanager-learning --timeout=180s
kubectl --context docker-desktop apply -f k8s/web-gateway.yaml
kubectl --context docker-desktop rollout status deployment/web-gateway -n taskmanager-learning --timeout=180s
kubectl --context docker-desktop port-forward -n taskmanager-learning service/web-gateway 3100:3000
```

Open [http://127.0.0.1:3100](http://127.0.0.1:3100). Remember: If port 3100 is occupied, use `3101:3000` and open port 3101 instead.

## Review deployment

```powershell
kubectl --context docker-desktop get pods,svc,pvc -n taskmanager-learning
kubectl --context docker-desktop logs deployment/task-service -n taskmanager-learning --tail=20
kubectl --context docker-desktop logs deployment/web-gateway -n taskmanager-learning --tail=20
```

Use the CRUD: Create a task, complete it, try the filters, and refresh the page to make sure it was saved. Then remove it.

To try independent scaling:

```powershell
kubectl --context docker-desktop scale deployment/task-service --replicas=2 -n taskmanager-learning
kubectl --context docker-desktop scale deployment/web-gateway --replicas=2 -n taskmanager-learning
kubectl --context docker-desktop get deployments -n taskmanager-learning
```

Use `--replicas=1` to return each service to one instance. These commands do not change the YAML files.


