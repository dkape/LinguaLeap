@echo off
echo 🔧 Fixing package-lock.json sync issues after MongoDB migration...

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed or not in PATH
    echo Please install Node.js and npm first: https://nodejs.org/
    pause
    exit /b 1
)

REM Remove existing lock files
echo 🗑️  Removing old lock files...
if exist package-lock.json del package-lock.json
if exist server\package-lock.json del server\package-lock.json

REM Clean npm cache
echo 🧹 Cleaning npm cache...
npm cache clean --force

REM Reinstall dependencies
echo 📦 Reinstalling root dependencies...
npm install

echo 📦 Reinstalling server dependencies...
cd server
npm install
cd ..

REM Verify the installation
echo ✅ Verifying installation...
npm ci --dry-run
cd server
npm ci --dry-run
cd ..

echo ✅ Lock files updated successfully!
echo 💡 Now commit the changes:
echo    git add package-lock.json server/package-lock.json
echo    git commit -m "fix: update package-lock.json files after MongoDB migration"
echo    git push
pause