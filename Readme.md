Task 8: Kubernetes Deployment with HashiCorp Vault (Real Production GKE/EKS Scenario)*

🎯 *Objective*

Deploy a containerized microservice application into a Kubernetes cluster with secure secret management using **HashiCorp Vault**, along with scaling, service exposure, rolling updates, and monitoring readiness.

---

🧩 *Scenario*

Your company migrated applications from Docker standalone environment to Kubernetes for:

* High availability
* Auto scaling
* Self-healing
* Better resource management

During a security audit, the company discovered that storing sensitive credentials directly inside Kubernetes Secrets is not secure enough for production workloads.

To improve security and meet compliance requirements, the organization adopted **HashiCorp Vault** as a centralized secrets management solution.

Now you must deploy the application into:

**Google Kubernetes Engine (GKE)**

while securely retrieving secrets from Vault.

---

📌 *Architecture*

### Application Components:

Frontend → Nginx

Backend API → Node.js

Database → MySQL

Secrets Management → HashiCorp Vault

### Kubernetes Objects:

Deployment

Service

ConfigMap

Ingress

Horizontal Pod Autoscaler

ServiceAccount

Vault Agent Injector

---

📌 *Requirements*

### 🔹 *Part 1: Kubernetes Cluster Setup*

GKE

Create Kubernetes cluster in:

Google Cloud Platform

---

### 🔹 *Part 2: Application Containerization*

Create Docker image

Push image to:

Docker Hub

OR

GCR

---

### 🔹 *Part 3: HashiCorp Vault Setup*

Install HashiCorp Vault in Kubernetes.

Configure:

* Kubernetes Authentication
* Vault Policies
* Vault Roles
* Secret Injection

Store the following secrets in Vault:

* Database username
* Database password
* API keys

---

### 🔹 *Part 4: Kubernetes Deployment*

Create YAML files for:

### 1️⃣ *Deployment*

* 3 replicas
* Resource limits
* Environment variables
* Vault annotations for secret injection

### 2️⃣ *Service*

ClusterIP / LoadBalancer

### 3️⃣ *ConfigMap*

Store:

* App configuration
* Environment details

### 4️⃣ *Vault Secret Configuration*

Store:

* Database password
* API keys
* Application secrets

### 5️⃣ *Ingress*

Expose application externally

### 6️⃣ *Horizontal Pod Autoscaler*

Auto-scale backend application

---

📌 *Example Deployment YAML*

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: backend-app
spec:
replicas: 3
selector:
matchLabels:
app: backend
template:
metadata:
labels:
app: backend
annotations:
vault.hashicorp.com/agent-inject: "true"
vault.hashicorp.com/role: "backend-role"
vault.hashicorp.com/agent-inject-secret-config: "secret/data/backend"
spec:
serviceAccountName: backend-sa
containers:
- name: backend
image: rajesh/backend:v1
ports:
- containerPort: 5000
```

---

📌 *Example Service YAML*

```yaml
apiVersion: v1
kind: Service
metadata:
name: backend-service
spec:
selector:
app: backend
ports:
- port: 80
targetPort: 5000
type: LoadBalancer
```

---

📌 *Example Vault Secret*

```bash
vault kv put secret/backend \
db_user=root \
db_password=MySQLPass123 \
api_key=ABC123XYZ
```

---

🔧 *Expected Steps*

### *Step 1 — Create Cluster*

Example:

```bash
gcloud container clusters create dev-cluster
```

---

### *Step 2 — Connect Cluster*

```bash
kubectl get nodes
```

---

### *Step 3 — Install Vault*

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com

helm repo update

helm install vault hashicorp/vault
```

---

### *Step 4 — Configure Vault*

Enable Kubernetes Authentication:

```bash
vault auth enable kubernetes
```

Store Secrets:

```bash
vault kv put secret/backend \
db_user=root \
db_password=MySQLPass123 \
api_key=ABC123XYZ
```

Create Vault Role and Policy for Kubernetes access.

---

### *Step 5 — Deploy Application*

```bash
kubectl apply -f deployment.yaml

kubectl apply -f service.yaml

kubectl apply -f configmap.yaml

kubectl apply -f ingress.yaml
```

---

### *Step 6 — Verify Pods*

```bash
kubectl get pods

kubectl get svc

kubectl get ingress

kubectl describe pod <pod-name>
```

---

### *Step 7 — Verify Vault Secret Injection*

```bash
kubectl exec -it <pod-name> -- ls /vault/secrets
```

Verify application is successfully reading secrets from Vault.

---

### *Step 8 — Scale Application*

```bash
kubectl scale deployment backend-app --replicas=5
```

---

### *Step 9 — Configure Auto Scaling*

```bash
kubectl autoscale deployment backend-app \
--cpu-percent=70 \
--min=3 \
--max=10
```

---

### *Step 10 — Rolling Update*

```bash
kubectl set image deployment/backend-app backend=rajesh/backend:v2
```

---

✅ *Expected Output*

* Application accessible via external IP
* Pods running successfully
* Traffic distributed across replicas
* Rolling updates without downtime
* HashiCorp Vault installed and configured
* Secrets stored securely in Vault
* No hardcoded credentials in Kubernetes manifests
* Backend application retrieving secrets from Vault
* Horizontal Pod Autoscaler functioning correctly
* Production-grade secure Kubernetes deployment with centralized secrets management using HashiCorp Vault