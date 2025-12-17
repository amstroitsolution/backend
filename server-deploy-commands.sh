#!/bin/bash
# Server Deployment Commands
# Run this script on your VPS after pushing code to GitHub

echo "========================================="
echo "Deploying All Components"
echo "========================================="
echo ""

# Deploy Backend
echo "[1/3] Deploying Backend..."
cd /domains/api.yashper.com
if [ ! -d "backend" ]; then
  git clone https://github.com/amstroitsolution/backend.git backend
fi
cd backend
git pull origin main
npm install --production
pm2 restart yashper-backend || pm2 start server.js --name yashper-backend
pm2 save
echo "✅ Backend deployed!"
echo ""

# Deploy Frontend
echo "[2/3] Deploying Frontend..."
cd /domains/yashper.com
if [ ! -d "frontend-repo" ]; then
  git clone https://github.com/amstroitsolution/frontend.git frontend-repo
fi
cd frontend-repo
git pull origin main
npm install
VITE_API_BASE_URL=https://api.yashper.com npm run build
rm -rf /domains/yashper.com/public_html/*
cp -r dist/* /domains/yashper.com/public_html/
chown -R www-data:www-data /domains/yashper.com/public_html
chmod -R 755 /domains/yashper.com/public_html
echo "✅ Frontend deployed!"
echo ""

# Deploy Admin
echo "[3/3] Deploying Admin..."
cd /domains/admin.yashper.com
if [ ! -d "admin-repo" ]; then
  git clone https://github.com/amstroitsolution/admin.git admin-repo
fi
cd admin-repo
git pull origin main
npm install
VITE_API_BASE_URL=https://api.yashper.com npm run build
rm -rf /domains/admin.yashper.com/public_html/*
cp -r dist/* /domains/admin.yashper.com/public_html/
chown -R www-data:www-data /domains/admin.yashper.com/public_html
chmod -R 755 /domains/admin.yashper.com/public_html
echo "✅ Admin deployed!"
echo ""

echo "========================================="
echo "✅ All components deployed successfully!"
echo "========================================="
echo ""
echo "Your sites are live at:"
echo "  Frontend: https://yashper.com"
echo "  Admin: https://admin.yashper.com"
echo "  API: https://api.yashper.com"
