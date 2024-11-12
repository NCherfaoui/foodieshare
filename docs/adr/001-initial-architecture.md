# ADR 001 : Architecture Initiale du Projet

## Contexte

Nous développons **FoodieShare**, une plateforme de partage de recettes destinée aux passionnés de cuisine. Pour assurer une application robuste, évolutive et maintenable, il est essentiel de définir une architecture solide dès le départ.

## Décision

Nous avons décidé d'adopter une architecture basée sur les technologies suivantes :

### Frontend

- **Framework** : React avec TypeScript
- **Styling** : Tailwind CSS et les composants UI de Shadcn
- **Gestion d'état** : React Query pour les requêtes asynchrones
- **Routage** : React Router v6
- **Build Tools** : Vite pour une optimisation du temps de développement

### Backend

- **Serveur** : Node.js avec Express
- **Langage** : TypeScript pour la sécurité et la maintenabilité du code
- **Base de données** : MongoDB via Mongoose pour la flexibilité des schémas
- **Authentification** : JWT (JSON Web Tokens)
- **Cache** : Redis pour améliorer les performances
- **Gestion des erreurs** : Intégration avec Sentry pour le monitoring

### DevOps & Outils

- **Contrôle de version** : GitHub pour la collaboration
- **Intégration continue** : GitHub Actions pour les tests et déploiements automatisés
- **Conteneurisation** : Docker pour une cohérence entre les environnements
- **Documentation** : Swagger pour l'API et README détaillés
- **Monitoring** : Prometheus et Grafana pour la surveillance des performances

## Justification

- **TypeScript** assure une meilleure vérification des types et réduit les erreurs en production.
- **React** est un framework éprouvé avec une large communauté et un écosystème riche.
- **Express** est léger et facilite la création d'API RESTful.
- **MongoDB** offre une flexibilité de schéma adaptée aux données de recettes.
- **Redis** permet de mettre en cache les données fréquemment accédées, améliorant ainsi la vitesse de l'application.
- **Docker** facilite le déploiement et la scalabilité de l'application.

## Conséquences

- **Avantages** :
  - Architecture modulable facilitant l'ajout de nouvelles fonctionnalités.
  - Utilisation de technologies modernes favorisant le recrutement et la contribution open-source.
  - Meilleure performance grâce au cache et à l'optimisation des requêtes.

- **Inconvénients** :
  - Courbe d'apprentissage pour l'équipe sur certaines technologies.
  - Complexité accrue dans la configuration initiale des outils DevOps.

## Statut

Accepté ✅ — Date : 10/10/2023

## Actions à Entreprendre

- **Initialisation des Dépôts** : Créer les dépôts GitHub pour le frontend et le backend.
- **Configuration des Environnements** : Mettre en place les environnements de développement avec les configurations TypeScript.
- **Mise en Place de l'Intégration Continue** : Configurer GitHub Actions pour automatiser les tests et les déploiements.
- **Conteneurisation** : Créer les fichiers Docker nécessaires pour le déploiement.
- **Documentation** : Rédiger le README initial et configurer Swagger pour l'API.
- **Monitoring** : Intégrer Sentry, Prometheus et Grafana pour le suivi des performances.

---

Ce document sert de référence pour les décisions architecturales initiales du projet **FoodieShare**.# ADR 001 : Architecture Initiale du Projet

## Contexte

Nous développons **FoodieShare**, une plateforme de partage de recettes destinée aux passionnés de cuisine. Pour assurer une application robuste, évolutive et maintenable, il est essentiel de définir une architecture solide dès le départ.

## Décision

Nous avons décidé d'adopter une architecture basée sur les technologies suivantes :

### Frontend

- **Framework** : React avec TypeScript
- **Styling** : Tailwind CSS et les composants UI de Shadcn
- **Gestion d'état** : React Query pour les requêtes asynchrones
- **Routage** : React Router v6
- **Build Tools** : Vite pour une optimisation du temps de développement

### Backend

- **Serveur** : Node.js avec Express
- **Langage** : TypeScript pour la sécurité et la maintenabilité du code
- **Base de données** : MongoDB via Mongoose pour la flexibilité des schémas
- **Authentification** : JWT (JSON Web Tokens)
- **Cache** : Redis pour améliorer les performances
- **Gestion des erreurs** : Intégration avec Sentry pour le monitoring

### DevOps & Outils

- **Contrôle de version** : GitHub pour la collaboration
- **Intégration continue** : GitHub Actions pour les tests et déploiements automatisés
- **Conteneurisation** : Docker pour une cohérence entre les environnements
- **Documentation** : Swagger pour l'API et README détaillés
- **Monitoring** : Prometheus et Grafana pour la surveillance des performances

## Justification

- **TypeScript** assure une meilleure vérification des types et réduit les erreurs en production.
- **React** est un framework éprouvé avec une large communauté et un écosystème riche.
- **Express** est léger et facilite la création d'API RESTful.
- **MongoDB** offre une flexibilité de schéma adaptée aux données de recettes.
- **Redis** permet de mettre en cache les données fréquemment accédées, améliorant ainsi la vitesse de l'application.
- **Docker** facilite le déploiement et la scalabilité de l'application.

## Conséquences

- **Avantages** :
  - Architecture modulable facilitant l'ajout de nouvelles fonctionnalités.
  - Utilisation de technologies modernes favorisant le recrutement et la contribution open-source.
  - Meilleure performance grâce au cache et à l'optimisation des requêtes.

- **Inconvénients** :
  - Courbe d'apprentissage pour l'équipe sur certaines technologies.
  - Complexité accrue dans la configuration initiale des outils DevOps.

## Statut

Accepté ✅ — Date : 10/10/2023

## Actions à Entreprendre

- **Initialisation des Dépôts** : Créer les dépôts GitHub pour le frontend et le backend.
- **Configuration des Environnements** : Mettre en place les environnements de développement avec les configurations TypeScript.
- **Mise en Place de l'Intégration Continue** : Configurer GitHub Actions pour automatiser les tests et les déploiements.
- **Conteneurisation** : Créer les fichiers Docker nécessaires pour le déploiement.
- **Documentation** : Rédiger le README initial et configurer Swagger pour l'API.
- **Monitoring** : Intégrer Sentry, Prometheus et Grafana pour le suivi des performances.

---

Ce document sert de référence pour les décisions architecturales initiales du projet **FoodieShare**.