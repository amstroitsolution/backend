# 🚀 Quick Deployment Commands

## One-Line Deployment Commands

### Deploy Backend Only
```bash
ssh root@your-server "cd /domains/api.yashper.com/backend && git pull && npm install --production && pm2 restart yashper-backend"
```

### Deploy All Components (Backend + Frontend + Admin)
```bash
ssh root@your-server "bash /domains/api.yashper.com/backend/server-deploy-commands.sh"
```

### Quick Backend Update (No Dependencies)
```bash
ssh root@your-server "cd /domains/api.yashper.com/backend && git pull && pm2 restart yashper-backend"
```

## Server Setup (First Time Only)

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2
```bash
npm install -g pm2
pm2 startup
```

### Clone Backend Repository
```bash
mkdir -p /domains/api.yashper.com
cd /domains/api.yashper.com
git clone https://github.com/amstroitsolution/backend.git backend
cd backend
npm install --production
```

### Setup Environment Variables
```bash
cd /domains/api.yashper.com/backend
nano .env
# Paste your environment variables
```

### Start Backend with PM2
```bash
cd /domains/api.yashper.com/backend
pm2 start server.js --name yashper-backend
pm2 save
```

## Common Tasks

### View Logs
```bash
pm2 logs yashper-backend
```

### Restart Backend
```bash
pm2 restart yashper-backend
```

### Check Status
```bash
pm2 status
```

### Monitor Resources
```bash
pm2 monit
```

### Update Code and Restart
```bash
cd /domains/api.yashper.com/backend && git pull && pm2 restart yashper-backend
```

## Emergency Commands

### Stop Backend
```bash
pm2 stop yashper-backend
```

### Delete and Restart Fresh
```bash
pm2 delete yashper-backend
cd /domains/api.yashper.com/backend
pm2 start server.js --name yashper-backend
pm2 save
```

### Check What's Using Port 5009
```bash
sudo lsof -i :5009
```

### Kill Process on Port 5009
```bash
sudo kill -9 $(sudo lsof -t -i:5009)
```

## Testing

### Test API Health
```bash
curl http://localhost:5009/api/health
```

### Test from Outside Server
```bash
curl http://your-server-ip:5009/api/health
```

### Test Specific Endpoints
```bash
# Get all inquiries
curl http://localhost:5009/api/inquiries

# Get all contacts
curl http://localhost:5009/api/contact
```

## Backup Commands

### Backup .env File
```bash
cp /domains/api.yashper.com/backend/.env /domains/api.yashper.com/backend/.env.backup
```

### Backup Entire Backend
```bash
tar -czf backend-backup-$(date +%Y%m%d).tar.gz /domains/api.yashper.com/backend
```

---

**💡 Pro Tip:** Save these commands in a text file on your desktop for quick access!
