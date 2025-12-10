# LinguaLeap Kubernetes Deployment Guide

This guide explains how to deploy LinguaLeap to Kubernetes using Helm charts with ArgoCD, Traefik, and Let's Encrypt.

## 🎯 Prerequisites

### Required Components
- **Kubernetes Cluster** (1.21+)
- **Helm** (3.8+)
- **ArgoCD** installed and configured
- **Traefik** as ingress controller
- **cert-manager** for Let's Encrypt certificates

### Docker Images
Ensure your images are pushed to Docker Hub:
- `danielkape/lingualeap-frontend:latest`
- `danielkape/lingualeap-backend:latest`

## 🚀 Quick Deployment

### 1. Clone Repository
```bash
git clone <repository-url>
cd LinguaLeap
```

### 2. Configure Values
Edit `helm/lingualeap/values.yaml`:
```yaml
ingress:
  hosts:
    - host: lingualeap.yourdomain.com  # Change to your domain
      
config:
  clientUrl: "https://lingualeap.yourdomain.com"  # Change to your domain
  emailFrom: "noreply@lingualeap.yourdomain.com"  # Change to your email
  
  smtp:
    host: "smtp.yourdomain.com"  # Your SMTP server
    user: "noreply@lingualeap.yourdomain.com"
    password: "your-smtp-password"  # Your SMTP password

mongodb:
  auth:
    rootPassword: "secure-mongodb-root-password"  # Change this!
    password: "secure-mongodb-lingualeap-password"  # Change this!
```

### 3. Deploy with Helm
```bash
# Add MongoDB Helm repository (if using external MongoDB)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install LinguaLeap
helm install lingualeap ./helm/lingualeap \
  --namespace lingualeap \
  --create-namespace \
  --values ./helm/lingualeap/values.yaml
```

### 4. Verify Deployment
```bash
# Check pods
kubectl get pods -n lingualeap

# Check services
kubectl get svc -n lingualeap

# Check ingress
kubectl get ingress -n lingualeap
```

## 🔧 ArgoCD Integration

### 1. Create ArgoCD Application
Create `argocd-application.yaml`:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: lingualeap
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/yourusername/lingualeap
    targetRevision: main
    path: helm/lingualeap
    helm:
      valueFiles:
        - values.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: lingualeap
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### 2. Apply ArgoCD Application
```bash
kubectl apply -f argocd-application.yaml
```

### 3. Access ArgoCD UI
```bash
# Get ArgoCD admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Visit https://localhost:8080 and sync the application.

## 🌐 Traefik Configuration

### 1. Verify Traefik Installation
```bash
# Check Traefik pods
kubectl get pods -n traefik

# Check Traefik service
kubectl get svc -n traefik
```

### 2. Configure Traefik for LinguaLeap
The Helm chart includes Traefik annotations:
```yaml
ingress:
  className: "traefik"
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
```

## 🔒 Let's Encrypt SSL Certificates

### 1. Install cert-manager
```bash
# Add cert-manager Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.0 \
  --set installCRDs=true
```

### 2. Create ClusterIssuer
Create `letsencrypt-issuer.yaml`:
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@yourdomain.com  # Change this!
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik
```

### 3. Apply ClusterIssuer
```bash
kubectl apply -f letsencrypt-issuer.yaml
```

### 4. Verify Certificate
```bash
# Check certificate status
kubectl get certificate -n lingualeap

# Check certificate details
kubectl describe certificate lingualeap-tls -n lingualeap
```

## 📊 Monitoring and Logging

### 1. Enable Monitoring
Update `values.yaml`:
```yaml
monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
```

### 2. Check Application Health
```bash
# Check pod health
kubectl get pods -n lingualeap

# Check application logs
kubectl logs -f deployment/lingualeap-backend -n lingualeap
kubectl logs -f deployment/lingualeap-frontend -n lingualeap
```

### 3. Access Application
Visit https://lingualeap.yourdomain.com

## 🔧 Configuration Management

### Environment-Specific Values

#### Development
```yaml
# values-dev.yaml
replicaCount:
  frontend: 1
  backend: 1

resources:
  frontend:
    requests:
      cpu: 100m
      memory: 128Mi
  backend:
    requests:
      cpu: 100m
      memory: 128Mi

mongodb:
  persistence:
    size: 1Gi
```

#### Production
```yaml
# values-prod.yaml
replicaCount:
  frontend: 3
  backend: 3

resources:
  frontend:
    requests:
      cpu: 250m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
  backend:
    requests:
      cpu: 250m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

mongodb:
  persistence:
    size: 20Gi
```

### Deploy with Environment-Specific Values
```bash
# Development
helm upgrade --install lingualeap ./helm/lingualeap \
  --namespace lingualeap-dev \
  --create-namespace \
  --values ./helm/lingualeap/values.yaml \
  --values ./helm/lingualeap/values-dev.yaml

# Production
helm upgrade --install lingualeap ./helm/lingualeap \
  --namespace lingualeap-prod \
  --create-namespace \
  --values ./helm/lingualeap/values.yaml \
  --values ./helm/lingualeap/values-prod.yaml
```

## 🔍 Troubleshooting

### Common Issues

#### Pods Not Starting
```bash
# Check pod status
kubectl get pods -n lingualeap

# Check pod logs
kubectl logs <pod-name> -n lingualeap

# Describe pod for events
kubectl describe pod <pod-name> -n lingualeap
```

#### Database Connection Issues
```bash
# Check MongoDB pod
kubectl get pods -l app.kubernetes.io/component=mongodb -n lingualeap

# Check MongoDB logs
kubectl logs <mongodb-pod-name> -n lingualeap

# Test database connection
kubectl exec -it <backend-pod-name> -n lingualeap -- sh
# Inside container: mongosh $MONGODB_URI
```

#### SSL Certificate Issues
```bash
# Check certificate status
kubectl get certificate -n lingualeap

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Check certificate details
kubectl describe certificate lingualeap-tls -n lingualeap
```

#### Ingress Issues
```bash
# Check ingress status
kubectl get ingress -n lingualeap

# Check Traefik logs
kubectl logs -n traefik deployment/traefik

# Test ingress connectivity
curl -v https://lingualeap.yourdomain.com
```

### Debug Commands
```bash
# Get all resources
kubectl get all -n lingualeap

# Check events
kubectl get events -n lingualeap --sort-by='.lastTimestamp'

# Port forward for direct access
kubectl port-forward svc/lingualeap-frontend 8080:80 -n lingualeap
kubectl port-forward svc/lingualeap-backend 8081:80 -n lingualeap
```

## 🔄 Updates and Rollbacks

### Update Application
```bash
# Update Helm chart
helm upgrade lingualeap ./helm/lingualeap \
  --namespace lingualeap \
  --values ./helm/lingualeap/values.yaml

# Check rollout status
kubectl rollout status deployment/lingualeap-frontend -n lingualeap
kubectl rollout status deployment/lingualeap-backend -n lingualeap
```

### Rollback Application
```bash
# Check rollout history
helm history lingualeap -n lingualeap

# Rollback to previous version
helm rollback lingualeap -n lingualeap

# Rollback to specific revision
helm rollback lingualeap 2 -n lingualeap
```

## 🗑️ Cleanup

### Uninstall Application
```bash
# Uninstall Helm release
helm uninstall lingualeap -n lingualeap

# Delete namespace
kubectl delete namespace lingualeap

# Delete ArgoCD application
kubectl delete application lingualeap -n argocd
```

## 📝 Next Steps

After successful deployment:
1. **Configure DNS** to point to your Kubernetes cluster
2. **Set up monitoring** with Prometheus and Grafana
3. **Configure backups** for MongoDB data
4. **Set up CI/CD** for automated deployments
5. **Configure log aggregation** with ELK stack or similar

For advanced configurations and troubleshooting, refer to the individual component documentation:
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)