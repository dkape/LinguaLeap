# LinguaLeap Troubleshooting Guide

## 🔧 Common Issues and Solutions

### Package Lock File Sync Issues

#### Problem: `npm ci` fails with "package.json and package-lock.json are out of sync"

**Solution:**
```bash
# Fix frontend dependencies
rm package-lock.json
npm install

# Fix backend dependencies
cd server
rm package-lock.json
npm install
cd ..

# Commit the updated lock files
git add package-lock.json server/package-lock.json
git commit -m "fix: update package-lock.json files"
```

**Prevention:**
Always run `npm install` instead of manually editing package.json when adding dependencies.

### Docker Issues

#### Problem: Docker containers won't start

**Check container status:**
```bash
docker-compose -f docker-compose.dev.yml ps
```

**View container logs:**
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

**Common solutions:**
```bash
# Clean restart
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d --build

# Clear Docker cache
docker system prune -a
```

#### Problem: Port already in use

**Find and kill processes:**
```bash
# Check what's using the ports
lsof -i :9002  # Frontend
lsof -i :3001  # Backend
lsof -i :27017 # MongoDB

# Kill the processes
kill -9 <PID>
```

### MongoDB Issues

#### Problem: MongoDB connection fails

**Check MongoDB container:**
```bash
docker-compose -f docker-compose.dev.yml logs mongodb
```

**Test connection manually:**
```bash
# Connect to MongoDB container
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Test from backend container
docker-compose -f docker-compose.dev.yml exec backend npm run test:db
```

**Common solutions:**
- Ensure MongoDB container is running
- Check MONGODB_URI environment variable
- Verify database credentials in mongo-init.js

### CI/CD Pipeline Issues

#### Problem: GitHub Actions failing on dependency installation

**Solution 1: Update package-lock.json**
```bash
./scripts/fix-lockfile.sh
git add package-lock.json server/package-lock.json
git commit -m "fix: update package-lock.json files"
git push
```

**Solution 2: Force clean install in CI**
The pipeline now automatically handles out-of-sync lock files by removing them and regenerating.

#### Problem: Docker Hub push fails

**Check Docker Hub credentials:**
1. Go to GitHub repository → Settings → Secrets
2. Verify `DOCKER_PASSWORD` secret exists
3. Ensure the password is a Docker Hub access token, not your account password

### Kubernetes Deployment Issues

#### Problem: Pods not starting

**Check pod status:**
```bash
kubectl get pods -n lingualeap
kubectl describe pod <pod-name> -n lingualeap
```

**Common issues:**
- Image pull errors (check Docker Hub credentials)
- Resource limits too low
- Missing secrets or config maps

#### Problem: SSL certificate not working

**Check cert-manager:**
```bash
# Check certificate status
kubectl get certificate -n lingualeap

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Check certificate details
kubectl describe certificate lingualeap-tls -n lingualeap
```

**Common solutions:**
- Verify DNS points to your cluster
- Check ClusterIssuer configuration
- Ensure Traefik is properly configured

### Application Issues

#### Problem: Email verification not working

**Check email service:**
```bash
# Development: Check MailHog
curl http://localhost:8025/api/v2/messages

# Production: Check SMTP logs
kubectl logs -f deployment/lingualeap-backend -n lingualeap
```

**Common solutions:**
- Verify SMTP credentials
- Check firewall settings
- Ensure CLIENT_URL is correct

#### Problem: AI challenge generation fails

**Check backend logs:**
```bash
# Docker development
docker-compose -f docker-compose.dev.yml logs backend

# Kubernetes production
kubectl logs -f deployment/lingualeap-backend -n lingualeap
```

**Common solutions:**
- Verify Google Gemini API credentials
- Check internet connectivity
- Ensure AI service is properly configured

### Database Migration Issues

#### Problem: Data from MySQL needs to be migrated

**Export from MySQL:**
```bash
# Export users
mysqldump -u lingua -p lingua users > users_backup.sql

# Export other tables as needed
mysqldump -u lingua -p lingua learning_paths > learning_paths_backup.sql
```

**Import to MongoDB:**
Create a migration script to convert SQL data to MongoDB documents.

### Performance Issues

#### Problem: Application running slowly

**Check resource usage:**
```bash
# Docker
docker stats

# Kubernetes
kubectl top pods -n lingualeap
kubectl top nodes
```

**Solutions:**
- Increase resource limits in values.yaml
- Enable horizontal pod autoscaling
- Optimize database queries
- Add caching layer

### Development Environment Issues

#### Problem: Hot reload not working

**Docker development:**
```bash
# Ensure volumes are properly mounted
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

**Manual development:**
```bash
# Restart development servers
npm run dev
cd server && npm run dev
```

## 🆘 Getting Help

### Debug Information to Collect

When reporting issues, please include:

1. **Environment Information:**
   - Operating system
   - Node.js version (`node --version`)
   - Docker version (`docker --version`)
   - Kubernetes version (`kubectl version`)

2. **Error Logs:**
   ```bash
   # Docker logs
   docker-compose -f docker-compose.dev.yml logs

   # Kubernetes logs
   kubectl logs -f deployment/lingualeap-backend -n lingualeap
   ```

3. **Configuration:**
   - Environment variables (without sensitive data)
   - Docker Compose configuration
   - Helm values.yaml (without secrets)

### Support Channels

1. **Check Documentation:** Review all docs in the `docs/` directory
2. **Search Issues:** Look for similar issues in the repository
3. **Create Issue:** Provide detailed information and logs
4. **Community Support:** Ask in relevant forums or communities

### Quick Fixes Checklist

Before reporting an issue, try these quick fixes:

- [ ] Restart Docker containers
- [ ] Clear Docker cache (`docker system prune`)
- [ ] Update package-lock.json files
- [ ] Check environment variables
- [ ] Verify network connectivity
- [ ] Check resource availability (disk space, memory)
- [ ] Review recent changes in git history

This troubleshooting guide should help resolve most common issues with LinguaLeap development and deployment.