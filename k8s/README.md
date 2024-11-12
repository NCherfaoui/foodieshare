# 🚢 Configuration Kubernetes pour FoodieShare

Ce dossier contient les fichiers de configuration Kubernetes pour déployer FoodieShare dans un cluster Kubernetes.

## 📁 Structure des fichiers
```
k8s/
├── backend-deployment.yaml       # Déploiement de l'API
├── frontend-deployment.yaml      # Déploiement du frontend
├── mongodb-statefulset.yaml      # StatefulSet pour MongoDB
├── redis-statefulset.yaml        # StatefulSet pour Redis
└── ingress.yaml                  # Configuration de l'Ingress
```

## 🚀 Installation

### Prérequis

- Kubectl installé et configuré
- Cluster Kubernetes en cours d'exécution
- Helm (pour certaines dépendances optionnelles)

### Configuration

1. Créer un namespace dédié :
    ```bash
    kubectl create namespace foodieshare
    kubectl config set-context --current --namespace=foodieshare
    ```

2. Créer les secrets nécessaires :
    ```bash
    kubectl create secret generic mongodb-secret \
      --from-literal=username=admin \
      --from-literal=password=your_password

    kubectl create secret generic jwt-secret \
      --from-literal=JWT_SECRET=your_jwt_secret
    ```

### Déploiement

1. Déployer les services de base de données :
    ```bash
    kubectl apply -f mongodb-statefulset.yaml
    kubectl apply -f redis-statefulset.yaml
    ```

2. Déployer le backend :
    ```bash
    kubectl apply -f backend-deployment.yaml
    ```

3. Déployer le frontend :
    ```bash
    kubectl apply -f frontend-deployment.yaml
    ```

4. Configurer l'Ingress pour exposer les services :
    ```bash
    kubectl apply -f ingress.yaml
    ```

## 🔍 Vérification
Vérifier l'état des déploiements :
```bash
kubectl get deployments
kubectl get pods
kubectl get services
```
Vérifier les logs :
```bash
# Vérifier les logs du backend
kubectl logs -l app=backend

# Vérifier les logs du frontend
kubectl logs -l app=frontend
```

## 📊 Monitoring
L'application utilise Prometheus et Grafana pour le monitoring.

1. Installer Prometheus :
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/prometheus
```

2. Installer Grafana :
```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana
``` 
3. Configurer Prometheus et Grafana pour le monitoring :
```bash
kubectl apply -f prometheus.yaml
kubectl apply -f grafana.yaml
```
4. Accéder à Prometheus et Grafana :
```bash
http://localhost:9090
http://localhost:3000
```
5. Acceder aux dashboards :
```bash
# Prometheus
kubectl port-forward service/prometheus-server 9090:9090

# Grafana
kubectl port-forward service/grafana 3000:3000
```
## 🔄 Mise à jour
Pour mettre à jour les déploiements :
```bash
# Mettre à jour l'image du backend
kubectl set image deployment/backend backend=foodieshare-backend:nouvelle_version

# Mettre à jour l'image du frontend
kubectl set image deployment/frontend frontend=foodieshare-frontend:nouvelle_version
```

## 📝 Notes importantes

- Les StatefulSets (MongoDB et Redis) utilisent des PersistentVolumeClaims pour la persistance des données
- L'Ingress est configuré pour gérer le routage HTTP/HTTPS
- Les ressources sont configurées avec des limites et requêtes appropriées
- Les déploiements incluent des sondes de disponibilité pour assurer la fiabilité

## ⚠️ Dépannage
1. Vérifier les événements du cluster :
```bash
kubectl get events --sort-by='.metadata.creationTimestamp'
```
2. Décrire un pod problématique :
```bash
kubectl describe pod <pod-name>
```
3.Redémarrer un déploiement :
```bash
kubectl rollout restart deployment <deployment-name>
```


## 🧹 Nettoyage

Pour supprimer tous les composants déployés, exécuter :
```bash
kubectl delete -f .
```


