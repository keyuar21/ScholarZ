#!/bin/bash
# ============================================================
#  ScholarZ — AWS ECR Deploy Script
#  Builds and pushes the Docker image to Amazon ECR
#  Uses DOCKER_BUILDKIT=0 to disable buildx
# ============================================================

set -e  # Exit immediately on any error

# ---- Config ----
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID="910168469763"
ECR_REPO="scholarz"
IMAGE_TAG="latest"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"

echo ""
echo "============================================"
echo "  ScholarZ — AWS ECR Deploy"
echo "============================================"
echo "  Region  : ${AWS_REGION}"
echo "  ECR URI : ${ECR_URI}"
echo "============================================"
echo ""

# ---- Step 1: Authenticate with ECR ----
echo "▶ [1/4] Authenticating with AWS ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
echo "✅ Authenticated successfully."
echo ""

# ---- Step 2: Build Docker image for linux/amd64 (cross-compile from Apple Silicon) ----
echo "▶ [2/4] Building Docker image for linux/amd64..."
docker buildx build --platform linux/amd64 -t "${ECR_REPO}:${IMAGE_TAG}" --load .
echo "✅ Build complete."
echo ""

# ---- Step 3: Tag the image ----
echo "▶ [3/4] Tagging image..."
docker tag "${ECR_REPO}:${IMAGE_TAG}" "${ECR_URI}"
echo "✅ Tagged: ${ECR_URI}"
echo ""

# ---- Step 4: Push to ECR ----
echo "▶ [4/4] Pushing image to ECR..."
docker push "${ECR_URI}"
echo ""
echo "============================================"
echo "  ✅ Deployment complete!"
echo "  Image: ${ECR_URI}"
echo "============================================"
echo ""
