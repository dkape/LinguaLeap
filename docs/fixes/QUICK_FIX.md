# 🚨 Quick Fix for CI/CD Pipeline Issue

## Problem
The CI/CD pipeline is failing because the `package-lock.json` files contain references to Firebase dependencies that were removed during the MongoDB migration.

## Solution
Run one of these scripts to fix the package lock files:

### Option 1: Linux/Mac
```bash
./scripts/fix-lockfile.sh
```

### Option 2: Windows (Command Prompt)
```cmd
scripts\fix-lockfile.bat
```

### Option 3: Windows (PowerShell)
```powershell
.\scripts\fix-lockfile.ps1
```

### Option 4: Manual Fix
If the scripts don't work, run these commands manually:

```bash
# Remove old lock files
rm package-lock.json
rm server/package-lock.json

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
npm install
cd server && npm install && cd ..
```

## After Running the Fix

Commit the updated lock files:
```bash
git add package-lock.json server/package-lock.json
git commit -m "fix: update package-lock.json files after MongoDB migration"
git push
```

## Why This Happened
During the MongoDB migration, we removed Firebase dependencies from `package.json` files, but the `package-lock.json` files still contained references to those dependencies, causing the sync issue.

## Prevention
The CI/CD pipeline has been updated to automatically handle this situation in the future by regenerating lock files when they're out of sync.

---

**Expected Result**: After running the fix and pushing the changes, the CI/CD pipeline should pass successfully! 🎉