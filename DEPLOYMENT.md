# 🚀 Backend Deployment Guide

This guide covers deploying the Yashper backend to your production server.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Server Access**
   - SSH access to your server
   - Root or sudo privileges
   - Server IP or domain name

2. **Server Requirements**
   - Node.js v18+ installed
   - PM2 process manager installed
   - Git installed
   - MongoDB connection (local or Atlas)

3. **Environment Variables**
   - `.env` file configured on the server with:
     ```env
     MONGO_URI=mongodb://...
     PORT=5009
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ADMIN_EMAIL=admin@yashper.com
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     BASE_URL=https://api.yashper.com
     ```

## 🎯 Deployment Methods

### Method 1: Automated Deployment (Recommended)

#### On Windows:
```batch
# 1. Edit deploy-backend.bat and update server details:
#    - SERVER_USER (e.g., root)
#    - SERVER_HOST (e.g., 123.45.67.89 or api.yashper.com)
#    - SERVER_PORT (default: 22)

# 2. Run the deployment script:
deploy-backend.bat
```

#### On Linux/Mac:
```bash
# 1. Make the script executable:
chmod +x deploy-backend.sh

# 2. Run the deployment:
./deploy-backend.sh
```

### Method 2: Manual Deployment via SSH

```bash
# 1. Connect to your server
ssh root@your-server-ip

# 2. Navigate to the backend directory
cd /domains/api.yashper.com

# 3. Clone or update the repository
git clone https://github.com/amstroitsolution/backend.git backend
# OR if already exists:
cd backend && git pull origin main

# 4. Install dependencies
npm install --production

# 5. Create/update .env file
nano .env
# Add all required environment variables

# 6. Restart with PM2
pm2 restart yashper-backend
# OR if first time:
pm2 start server.js --name yashper-backend
pm2 save
pm2 startup
```

### Method 3: Using the Existing Script

```bash
# On your server, run:
bash /path/to/server-deploy-commands.sh
```

## 🔍 Verification

After deployment, verify everything is working:

```bash
# 1. Check PM2 status
pm2 status

# 2. View logs
pm2 logs yashper-backend --lines 50

# 3. Test the API
curl http://localhost:5009/api/health

# 4. Check MongoDB connection
pm2 logs yashper-backend | grep "MongoDB Connected"
```

## 🛠️ Troubleshooting

### Backend Won't Start

```bash
# Check logs for errors
pm2 logs yashper-backend --err

# Common issues:
# 1. Port already in use
sudo lsof -i :5009
# Kill the process if needed

# 2. MongoDB connection failed
# Verify MONGO_URI in .env

# 3. Missing dependencies
cd /domains/api.yashper.com/backend
npm install
```

### Email Service Not Working

```bash
# Check email credentials in .env
cat /domains/api.yashper.com/backend/.env | grep EMAIL

# Test email service
# The backend will use fallback service if primary fails
```

### PM2 Process Crashes

```bash
# View crash logs
pm2 logs yashper-backend --err --lines 100

# Restart with more memory
pm2 delete yashper-backend
pm2 start server.js --name yashper-backend --max-memory-restart 500M
pm2 save
```

## 📊 Useful PM2 Commands

```bash
# View all processes
pm2 list

# Monitor in real-time
pm2 monit

# View logs
pm2 logs yashper-backend

# Restart
pm2 restart yashper-backend

# Stop
pm2 stop yashper-backend

# Delete process
pm2 delete yashper-backend

# Save current process list
pm2 save

# Setup auto-start on server reboot
pm2 startup
```

## 🔄 Updating After Code Changes

When you make changes to the backend code:

```bash
# Option 1: Use deployment script
./deploy-backend.sh

# Option 2: Manual update
ssh root@your-server
cd /domains/api.yashper.com/backend
git pull origin main
npm install --production
pm2 restart yashper-backend
```

## 🔐 Security Checklist

- [ ] `.env` file is NOT committed to Git
- [ ] MongoDB uses authentication
- [ ] Email credentials are app-specific passwords
- [ ] Cloudinary credentials are secure
- [ ] Server firewall is configured
- [ ] PM2 is set to auto-restart on crashes
- [ ] Regular backups are configured

## 📞 Support

If you encounter issues:

1. Check the logs: `pm2 logs yashper-backend`
2. Verify environment variables: `cat .env`
3. Test MongoDB connection: `mongo "your-connection-string"`
4. Check server resources: `htop` or `free -h`

## 🎉 Success!

If everything is working:
- ✅ PM2 shows "online" status
- ✅ API responds at http://localhost:5009
- ✅ MongoDB connection is established
- ✅ Email service is configured (check logs)
- ✅ Cloudinary is connected

Your backend is now deployed and running! 🚀
