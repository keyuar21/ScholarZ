#!/bin/bash
# ============================================================
#  ScholarZ — Kind Cluster + K8s Deploy Script
#  Run this AFTER setup-ec2.sh and aws configure
#  Usage: bash k8s-deploy.sh
# ============================================================

set -e

AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID="910168469763"
ECR_REPO="scholarz"
IMAGE_TAG="latest"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"
CLUSTER_NAME="scholarz-cluster"

echo ""
echo "============================================"
echo "  ScholarZ — Kind + K8s Deploy"
echo "============================================"
echo ""

# ---- Step 1: Create Kind cluster ----
echo "▶ [1/6] Creating Kind cluster: ${CLUSTER_NAME}..."
if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
  echo "  ℹ️  Cluster '${CLUSTER_NAME}' already exists. Skipping."
else
  kind create cluster --config k8s/kind-config.yaml
  echo "✅ Cluster created."
fi
echo ""

# ---- Step 2: Install NGINX Ingress Controller ----
echo "▶ [2/6] Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

echo "  ⏳ Waiting for Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
echo "✅ NGINX Ingress Controller ready."
echo ""

# ---- Step 3: Pull image from ECR and load into kind ----
echo "▶ [3/6] Authenticating with AWS ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
echo "✅ Authenticated."
echo ""

echo "▶ [4/6] Pulling image from ECR and loading into Kind..."
docker pull "${ECR_URI}"
kind load docker-image "${ECR_URI}" --name "${CLUSTER_NAME}"
echo "✅ Image loaded into Kind cluster."
echo ""

# ---- Step 5: Apply Kubernetes manifests ----
echo "▶ [5/6] Applying Kubernetes manifests..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
echo "✅ Manifests applied."
echo ""

# ---- Step 6: Wait for pods to be ready ----
echo "▶ [6/6] Waiting for all 4 pods to be ready..."
kubectl rollout status deployment/scholarz --timeout=120s
echo ""

# ---- Show status ----
echo "============================================"
echo "  ✅ Deployment Complete!"
echo "============================================"
echo ""
echo "  Pod Status:"
kubectl get pods -o wide
echo ""
echo "  Service Status:"
kubectl get svc
echo ""
echo "  Ingress:"
kubectl get ingress
echo ""
echo "  🌐 ScholarZ is live at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo ""
echo "  Useful commands:"
echo "    kubectl get pods                   # Check pod health"
echo "    kubectl logs <pod-name>            # View pod logs"
echo "    kubectl scale deployment scholarz --replicas=4   # Scale"
echo "    kind delete cluster --name ${CLUSTER_NAME}       # Teardown"
echo "============================================"
echo ""
