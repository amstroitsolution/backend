#!/bin/bash
# Quick deployment script - Run this on your server

echo "🚀 Deploying updated backend code..."

# Navigate to backend directory
cd /home/admin/domains/api.yashper.com/backend

# Pull latest changes
echo "📥 Pulling latest code from Git..."
git pull origin main

# Install any new dependencies
echo "📦 Installing dependencies..."
npm install --production

# Restart PM2
echo "🔄 Restarting backend service..."
pm2 restart yashper-backend

# Show status
echo "✅ Deployment complete!"
echo ""
pm2 status yashper-backend

echo ""
echo "📊 Checking logs..."
pm2 logs yashper-backend --lines 20 --nostream
