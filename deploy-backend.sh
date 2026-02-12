#!/bin/bash
# Backend Deployment Script for Yashper
# This script deploys the backend with all dependencies and restarts the service

set -e  # Exit on any error

echo "========================================="
echo "🚀 Deploying Yashper Backend"
echo "========================================="
echo ""

# Configuration
BACKEND_DIR="/domains/api.yashper.com/backend"
REPO_URL="https://github.com/amstroitsolution/backend.git"
PM2_APP_NAME="yashper-backend"

# Step 1: Navigate to backend directory
echo "📂 Step 1/6: Navigating to backend directory..."
cd /domains/api.yashper.com

# Step 2: Clone or pull latest code
echo "📥 Step 2/6: Fetching latest code from GitHub..."
if [ ! -d "backend" ]; then
  echo "   Cloning repository..."
  git clone $REPO_URL backend
else
  echo "   Repository exists, pulling latest changes..."
  cd backend
  git fetch origin
  git reset --hard origin/main
  git pull origin main
  cd ..
fi

# Step 3: Install dependencies
echo "📦 Step 3/6: Installing dependencies..."
cd backend
npm install --production

# Step 4: Verify environment variables
echo "🔐 Step 4/6: Checking environment variables..."
if [ ! -f ".env" ]; then
  echo "   ⚠️  WARNING: .env file not found!"
  echo "   Please create .env file with required variables:"
  echo "   - MONGO_URI"
  echo "   - EMAIL_USER"
  echo "   - EMAIL_PASS"
  echo "   - CLOUDINARY_CLOUD_NAME"
  echo "   - CLOUDINARY_API_KEY"
  echo "   - CLOUDINARY_API_SECRET"
  echo ""
  read -p "   Do you want to continue anyway? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo "   ✅ .env file found"
fi

# Step 5: Restart PM2 service
echo "🔄 Step 5/6: Restarting backend service..."
if pm2 describe $PM2_APP_NAME > /dev/null 2>&1; then
  echo "   Restarting existing PM2 process..."
  pm2 restart $PM2_APP_NAME
  pm2 save
else
  echo "   Starting new PM2 process..."
  pm2 start server.js --name $PM2_APP_NAME
  pm2 save
  pm2 startup
fi

# Step 6: Verify deployment
echo "✅ Step 6/6: Verifying deployment..."
sleep 3
if pm2 describe $PM2_APP_NAME | grep -q "online"; then
  echo "   ✅ Backend is running successfully!"
else
  echo "   ❌ Backend failed to start. Check logs with: pm2 logs $PM2_APP_NAME"
  exit 1
fi

echo ""
echo "========================================="
echo "✅ Backend Deployment Complete!"
echo "========================================="
echo ""
echo "📊 Service Status:"
pm2 describe $PM2_APP_NAME | grep -E "status|uptime|restarts"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:     pm2 logs $PM2_APP_NAME"
echo "   Restart:       pm2 restart $PM2_APP_NAME"
echo "   Stop:          pm2 stop $PM2_APP_NAME"
echo "   Monitor:       pm2 monit"
echo ""
echo "🌐 API should be accessible at: http://localhost:5009"
echo ""
