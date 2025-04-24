# Étape 1 : Build de l'application
FROM node:23-alpine AS builder

WORKDIR /app

# 1. Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# 2. Installation des dépendances (avec cache optimisé)
RUN npm ci --production && \
    npm cache clean --force

# 3. Copie du code source
COPY . .

# 4. Build de production
RUN npm run build

# Étape 2 : Serveur Nginx minimaliste
FROM nginx:alpine

# 1. Configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Copie des artefacts de build depuis l'étape builder
COPY --from=builder /app/dist /usr/share/nginx/html

# 3. Sécurité : Utilisateur non-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 4. Port exposé
EXPOSE 80

# 5. Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]