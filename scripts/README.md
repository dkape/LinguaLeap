# LinguaLeap Scripts

This directory contains utility scripts to help with common development and deployment tasks.

## Fix Scripts

### Package Lock File Issues

When you encounter CI/CD failures with "package.json and package-lock.json are out of sync", use one of these scripts:

#### Linux/Mac
```bash
./scripts/fix-lockfile.sh
```

#### Windows (Command Prompt)
```cmd
scripts\fix-lockfile.bat
```

#### Windows (PowerShell)
```powershell
.\scripts\fix-lockfile.ps1
```

All scripts will:
1. Remove existing package-lock.json files
2. Clean npm cache
3. Reinstall dependencies
4. Verify the installation
5. Show you the git commands to commit the changes

### After Running Fix Scripts

Once the script completes successfully, commit the updated lock files:

```bash
git add package-lock.json server/package-lock.json
git commit -m "fix: update package-lock.json files after MongoDB migration"
git push
```

This will resolve the CI/CD pipeline issues and allow your builds to pass.

## Other Scripts

- `setup-dev.sh` - Set up development environment
- `deploy-k8s.sh` - Deploy to Kubernetes
- `backup-db.sh` - Backup MongoDB data

## Troubleshooting

If you encounter issues with these scripts, check:

1. **Node.js/npm installed**: Ensure Node.js and npm are installed and in your PATH
2. **Permissions**: On Linux/Mac, you may need to make scripts executable: `chmod +x scripts/*.sh`
3. **Network connectivity**: Some scripts require internet access to download dependencies

For more detailed troubleshooting, see [docs/troubleshooting.md](../docs/troubleshooting.md).