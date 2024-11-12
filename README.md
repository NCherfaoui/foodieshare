# FoodieShare - Plateforme de Partage de Recettes
![CI](https://github.com/{owner}/{repo}/workflows/Intégration%20Continue/badge.svg)

## 🌟 À propos
FoodieShare est une plateforme moderne de partage de recettes qui permet aux passionnés de cuisine de partager, découvrir et interagir avec des recettes du monde entier.

## ✨ Fonctionnalités

### Actuelles
- 👤 Authentification utilisateur (inscription/connexion)
- 📝 Création, modification et suppression de recettes
- ⭐ Système de notation des recettes
- 💭 Commentaires sur les recettes
- ❤️ Système de favoris
- 🔍 Recherche de recettes
- 📱 Interface responsive
- 👥 Système de rôles utilisateurs (admin/user)
- 🔒 Gestion des permissions
  - Administrateurs : modification/suppression de toutes les recettes
  - Utilisateurs : gestion de leurs propres recettes
  - Visiteurs : lecture seule

### À venir
- 📸 Upload d'images pour les recettes
- 🏷️ Système de tags et catégories avancé
- 🌐 Partage sur les réseaux sociaux
- 📤 Export de recettes en PDF
- 👥 Profils utilisateurs améliorés
- 📊 Tableaux de nutrition
- 🛒 Liste de courses générée
- 🔄 Ajustement des portions

## 🛠️ Technologies utilisées

### Frontend
- React
- TypeScript
- Shadcn/UI
- TailwindCSS
- React Query
- React Router

### Backend
- Node.js
- Express
- MongoDB
- TypeScript
- JWT

## 🚀 Pré-requis
- Node.js 18 ou plus
- MongoDB installé ou avec Docker
- Docker installé et en cours d'exécution
- Git

## 🧭 Pré-requis supplemmentaires
- [Sentry](https://sentry.io)
- [Prometheus](https://prometheus.io)
- [Grafana](https://grafana.com)


## 🚀 Installation
```
# Cloner le projet
git clone https://github.com/NCherfaoui/foodieshare.git
``` 

### 📝 Configuration
Créez soit: 
- les fichiers `.env.development` dans les dossiers frontend et backend :

- Frontend (`.env.development`)
```
VITE_API_URL=http://localhost:3000/api
```
- Backend (`.env.development`)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/foodieshare
JWT_SECRET=votre_secret_jwt
CORS_ORIGIN=http://localhost:5173
```
- Ou à la racine du projet (`.env.development`):

```# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=password
MONGODB_URI=mongodb://admin:password@mongodb:27017/foodieshare

# Redis
REDIS_URL=redis://redis:6379

# API
PORT=3000
API_URL=http://localhost:3000/api

# Frontend
VITE_API_URL=http://localhost:3000/api

# JWT
JWT_SECRET=votre_secret_jwt

# CORS
CORS_ORIGIN=http://localhost:5173
```


### 📦 Installation des dépendances
```bash
# Installation des dépendances Frontend
cd frontend
npm install

# Installation des dépendances Backend
cd backend
npm install

# Configuration des variables d'environnement
cp .env.exemple .env.development
```

### 🚀 Démarrage
```bash

# Démarrer le serveur de développement Frontend
npm run dev

# Démarrer le serveur de développement Backend
npm run dev
```
### 🚀 Lancement avec Docker 
1. Vérifier que Docker Desktop est en cours d'exécution
2. Démarrer l'application en mode développement :

```bash
docker compose -f docker-compose.dev.yml up
```
3. L'application sera accessible sur :

* Frontend : http://localhost:5173
* API : http://localhost:3000
* MongoDB : localhost:27017
* Redis : localhost:6379
* Grafana : http://localhost:3000/grafana
* Prometheus : http://localhost:3000/prometheus

#### Arrêt de l'application
pour arreter l'application :
```bash
docker compose -f docker-compose.dev.yml down
```

## 🔧 Commandes Utiles 
```bash
# Reconstruction des images
docker compose -f docker-compose.dev.yml up --build

# Voir les logs
docker compose -f docker-compose.dev.yml logs -f

# Redémarrer un service spécifique
docker compose -f docker-compose.dev.yml restart <service-name>

# Nettoyer les volumes
docker compose -f docker-compose.dev.yml down -v
```
## 🛠️ Dépannage 
1. Erreur de connexion à MongoDB
- Vérifier que les credentials dans .env.development correspondent
- Vérifier que le service MongoDB est bien démarré

2. Le hot-reload ne fonctionne pas

- Vérifier que les volumes sont correctement montés
- Redémarrer le service concerné

3.  Problèmes de permissions Docker

- Sous Windows, vérifier que Docker Desktop a les droits administrateur



---

## 📚 Documentation du projet

## 🛠️ Configuration des rôles

### Rôles disponibles
- `user` : Rôle par défaut
  - Création de recettes
  - Modification de ses propres recettes
  - Notation et commentaires
  - Gestion de ses favoris
- `admin` : Rôle administrateur
  - Toutes les permissions utilisateur
  - Modification de toutes les recettes
  - Suppression de recettes
  - Gestion du contenu

## 📚 Documentation API
La documentation de l'API est disponible à l'adresse : `http://localhost:3000/api-docs`

---

## 🤝 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ✍️ Auteur
- Nassim CHERFAOUI - [GitHub](https://github.com/NCherfaoui)
