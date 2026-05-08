#!/bin/bash
# ============================================================
#  ScholarZ — EC2 Bootstrap Script
#  Installs Docker, kubectl, kind on a fresh Ubuntu x86 instance
#  Run as: sudo bash setup-ec2.sh
# ============================================================

set -e

echo ""
echo "============================================"
echo "  ScholarZ — EC2 Environment Setup"
echo "  Ubuntu x86 Bootstrap"
echo "============================================"
echo ""

# ---- Update system ----
echo "▶ [1/6] Updating system packages..."
apt-get update -y && apt-get upgrade -y
apt-get install -y \
  curl wget git unzip \
  ca-certificates gnupg lsb-release \
  apt-transport-https software-properties-common
echo "✅ System updated."
echo ""

# ---- Install Docker ----
echo "▶ [2/6] Installing Docker..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin

systemctl enable docker
systemctl start docker

# Allow ubuntu user to run docker without sudo
usermod -aG docker ubuntu

echo "✅ Docker installed: $(docker --version)"
echo ""

# ---- Install kubectl ----
echo "▶ [3/6] Installing kubectl..."
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | \
  gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
  https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" | \
  tee /etc/apt/sources.list.d/kubernetes.list

apt-get update -y
apt-get install -y kubectl

echo "✅ kubectl installed: $(kubectl version --client --short 2>/dev/null || kubectl version --client)"
echo ""

# ---- Install kind ----
echo "▶ [4/6] Installing kind..."
KIND_VERSION="v0.23.0"
curl -Lo /usr/local/bin/kind \
  "https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-linux-amd64"
chmod +x /usr/local/bin/kind
echo "✅ kind installed: $(kind --version)"
echo ""

# ---- Install Helm (optional but useful) ----
echo "▶ [5/6] Installing Helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
echo "✅ Helm installed: $(helm version --short)"
echo ""

# ---- Install AWS CLI (for ECR pulls) ----
echo "▶ [6/6] Installing AWS CLI..."
curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
unzip -q /tmp/awscliv2.zip -d /tmp
/tmp/aws/install --update
rm -rf /tmp/aws /tmp/awscliv2.zip
echo "✅ AWS CLI installed: $(aws --version)"
echo ""

echo "============================================"
echo "  ✅ EC2 Bootstrap Complete!"
echo ""
echo "  NEXT STEPS:"
echo "  1. Log out and back in (or run: newgrp docker)"
echo "  2. Configure AWS:  aws configure"
echo "  3. Run the cluster: bash k8s-deploy.sh"
echo "============================================"
echo ""
