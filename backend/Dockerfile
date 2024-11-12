# Étape de build
FROM node:18-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie des fichiers sources
COPY . .

# Build de l'application TypeScript
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Copie des fichiers necessaires
COPY package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --only=production

# Configuration
ENV NODE_ENV=production
ENV PORT=5000

# Exposition du port
EXPOSE 5000

# Démarrage de l'application
CMD ["node", "dist/index.js"]