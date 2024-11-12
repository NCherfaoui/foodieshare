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

## 🚀 Installation
```
# Cloner le projet
git clone https://github.com/NCherfaoui/foodieshare.git

# Installation des dépendances Frontend
cd frontend
npm install

# Installation des dépendances Backend
cd backend
npm install

# Configuration des variables d'environnement
cp .env.exemple .env.development

# Démarrer le serveur de développement Frontend
npm run dev

# Démarrer le serveur de développement Backend
npm run dev
```

### 📝 Configuration
Créez les fichiers `.env.development` dans les dossiers frontend et backend :

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
