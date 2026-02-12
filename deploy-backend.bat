@echo off
REM Backend Deployment Script for Yashper (Windows)
REM This script helps you deploy the backend to your server via SSH

echo =========================================
echo 🚀 Deploying Yashper Backend to Server
echo =========================================
echo.

REM Check if SSH is available
where ssh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ SSH not found. Please install OpenSSH or use PuTTY.
    echo.
    echo Install OpenSSH: Settings ^> Apps ^> Optional Features ^> OpenSSH Client
    pause
    exit /b 1
)

REM Configuration - UPDATE THESE VALUES
set SERVER_USER=root
set SERVER_HOST=your-server-ip-or-domain
set SERVER_PORT=22

echo 📝 Server Configuration:
echo    User: %SERVER_USER%
echo    Host: %SERVER_HOST%
echo    Port: %SERVER_PORT%
echo.

REM Prompt for confirmation
set /p CONFIRM="Continue with deployment? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Deployment cancelled.
    exit /b 0
)

echo.
echo 📤 Uploading deployment script to server...

REM Upload the deployment script
scp -P %SERVER_PORT% deploy-backend.sh %SERVER_USER%@%SERVER_HOST%:/tmp/deploy-backend.sh

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to upload deployment script
    pause
    exit /b 1
)

echo ✅ Script uploaded successfully
echo.
echo 🔧 Executing deployment on server...
echo.

REM Execute the deployment script on the server
ssh -p %SERVER_PORT% %SERVER_USER%@%SERVER_HOST% "chmod +x /tmp/deploy-backend.sh && /tmp/deploy-backend.sh"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Deployment failed. Check the error messages above.
    pause
    exit /b 1
)

echo.
echo =========================================
echo ✅ Deployment Completed Successfully!
echo =========================================
echo.
echo 📊 Next Steps:
echo    1. Test the API: curl http://%SERVER_HOST%:5009/api/health
echo    2. Check logs: ssh %SERVER_USER%@%SERVER_HOST% "pm2 logs yashper-backend"
echo    3. Monitor: ssh %SERVER_USER%@%SERVER_HOST% "pm2 monit"
echo.
pause
