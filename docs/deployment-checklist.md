# LinguaLeap Deployment Checklist

## 🚀 Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Repository cloned locally
- [ ] All dependencies installed
- [ ] Package-lock.json files are in sync
- [ ] Environment variables configured
- [ ] Docker Hub account ready (danielkape)

### 2. Local Development Testing
- [ ] Docker development environment working
- [ ] Frontend accessible at http://localhost:9002
- [ ] Backend API responding at http://localhost:3001
- [ ] MongoDB connection successful
- [ ] Email testing with MailHog working
- [ ] User registration and verification flow tested
- [ ] Challenge generation working
- [ ] Language switching functional

### 3. CI/CD Pipeline Setup
- [ ] GitHub repository configured
- [ ] Docker Hub credentials added to GitHub Secrets (`DOCKER_PASSWORD`)
- [ ] CI/CD pipeline passing all tests
- [ ] Docker images building and pushing successfully

## 🐳 Docker Development Deployment

### Quick Commands
```bash
# Fix dependencies first
./scripts/fix-lockfile.sh
git add package-lock.json server/package-lock.json
git commit -m "fix: update package-lock.json files"

# Start development environment
./scripts/setup-dev.sh
```

### Verification Steps
- [ ] All containers running: `docker-compose -f docker-compose.dev.yml ps`
- [ ] Frontend loads: http://localhost:9002
- [ ] Backend health check: http://localhost:3001/health
- [ ] MailHog interface: http://localhost:8025
- [ ] MongoDB accessible: `docker-compose -f docker-compose.dev.yml exec mongodb mongosh`

## ☸️ Kubernetes Production Deployment

### Prerequisites
- [ ] Kubernetes cluster accessible
- [ ] kubectl configured and working
- [ ] Helm 3.8+ installed
- [ ] Traefik ingress controller installed
- [ ] cert-manager installed for SSL certificates
- [ ] ArgoCD installed (optional but recommended)

### Configuration Steps

#### 1. Update Helm Values
Edit `helm/lingualeap/values.yaml`:
```yaml
ingress:
  hosts:
    - host: lingualeap.yourdomain.com  # ✏️ Change this

config:
  clientUrl: "https://lingualeap.yourdomain.com"  # ✏️ Change this
  emailFrom: "noreply@lingualeap.yourdomain.com"  # ✏️ Change this
  jwtSecret: "your-super-secure-jwt-secret-change-this"  # ✏️ Change this
  
  smtp:
    host: "smtp.yourdomain.com"  # ✏️ Change this
    user: "noreply@lingualeap.yourdomain.com"  # ✏️ Change this
    password: "your-smtp-password"  # ✏️ Change this

mongodb:
  auth:
    rootPassword: "secure-mongodb-root-password"  # ✏️ Change this
    password: "secure-mongodb-lingualeap-password"  # ✏️ Change this
```

#### 2. Deploy to Kubernetes
```bash
# Deploy with Helm
./scripts/deploy-k8s.sh

# Or deploy manually
helm install lingualeap ./helm/lingualeap \
  --namespace lingualeap \
  --create-namespace \
  --values ./helm/lingualeap/values.yaml
```

#### 3. Set up ArgoCD (Optional)
```bash
# Apply ArgoCD application
kubectl apply -f argocd-application.yaml

# Check ArgoCD sync status
kubectl get application lingualeap -n argocd
```

### Verification Steps
- [ ] All pods running: `kubectl get pods -n lingualeap`
- [ ] Services accessible: `kubectl get svc -n lingualeap`
- [ ] Ingress configured: `kubectl get ingress -n lingualeap`
- [ ] SSL certificate issued: `kubectl get certificate -n lingualeap`
- [ ] Application accessible via HTTPS
- [ ] Health checks passing: `curl https://lingualeap.yourdomain.com/api/health`

## 🔒 Security Checklist

### Development Security
- [ ] Default passwords used (not for production)
- [ ] MailHog for email testing (not exposed externally)
- [ ] Local network access only

### Production Security
- [ ] Strong passwords for all services
- [ ] SSL certificates configured and working
- [ ] Secrets properly managed in Kubernetes
- [ ] Non-root containers running
- [ ] Resource limits configured
- [ ] Network policies applied (optional)
- [ ] Regular security updates scheduled

## 📊 Monitoring Checklist

### Health Checks
- [ ] Frontend health check: `curl https://yourdomain.com/`
- [ ] Backend health check: `curl https://yourdomain.com/api/health`
- [ ] Database connectivity: MongoDB ping successful

### Logging
- [ ] Application logs accessible
- [ ] Error tracking configured
- [ ] Performance monitoring enabled

### Metrics
- [ ] Pod resource usage monitored
- [ ] Application performance tracked
- [ ] Database performance monitored

## 🔄 Post-Deployment Tasks

### 1. DNS Configuration
- [ ] Domain points to Kubernetes cluster
- [ ] SSL certificate issued successfully
- [ ] HTTPS redirect working

### 2. Application Testing
- [ ] User registration working
- [ ] Email verification functional
- [ ] Teacher can create classes
- [ ] AI challenge generation working
- [ ] Student can complete challenges
- [ ] Leaderboard updating correctly
- [ ] Language switching working

### 3. Performance Optimization
- [ ] Resource usage optimized
- [ ] Auto-scaling configured
- [ ] Database indexes created
- [ ] Caching implemented (if needed)

### 4. Backup and Recovery
- [ ] MongoDB backup strategy implemented
- [ ] Application configuration backed up
- [ ] Recovery procedures documented
- [ ] Disaster recovery plan created

## 🚨 Emergency Procedures

### Rollback Deployment
```bash
# Helm rollback
helm rollback lingualeap -n lingualeap

# ArgoCD rollback
kubectl patch application lingualeap -n argocd --type merge -p '{"operation":{"sync":{"revision":"previous-commit-hash"}}}'
```

### Scale Down/Up
```bash
# Scale down
kubectl scale deployment lingualeap-frontend --replicas=0 -n lingualeap
kubectl scale deployment lingualeap-backend --replicas=0 -n lingualeap

# Scale up
kubectl scale deployment lingualeap-frontend --replicas=2 -n lingualeap
kubectl scale deployment lingualeap-backend --replicas=2 -n lingualeap
```

### Emergency Database Access
```bash
# Access MongoDB directly
kubectl exec -it <mongodb-pod-name> -n lingualeap -- mongosh
```

## 📞 Support Information

### Log Collection
```bash
# Collect all logs for support
mkdir -p logs
kubectl logs deployment/lingualeap-frontend -n lingualeap > logs/frontend.log
kubectl logs deployment/lingualeap-backend -n lingualeap > logs/backend.log
kubectl logs deployment/lingualeap-mongodb -n lingualeap > logs/mongodb.log
kubectl get events -n lingualeap > logs/events.log
```

### System Information
```bash
# Collect system information
kubectl version > logs/kubectl-version.txt
helm version > logs/helm-version.txt
kubectl get nodes -o wide > logs/nodes.txt
kubectl get all -n lingualeap > logs/resources.txt
```

This troubleshooting guide should help resolve most issues you might encounter during development and deployment of LinguaLeap.