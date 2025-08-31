FROM node:20-alpine AS base
# Installation pnpm optimisée avec librairies système
RUN apk add --no-cache libc6-compat \
    && npm install -g pnpm@9 \
    && pnpm config set store-dir /root/.pnpm-store \
    && pnpm config set network-timeout 300000 \
    && pnpm config set fetch-retries 3
WORKDIR /app

# Stage 1: Installation dépendances avec cache intelligent
FROM base AS deps
COPY package.json pnpm-lock.yaml ./

# Cache mount partagé + installation parallèle
RUN --mount=type=cache,target=/root/.pnpm-store,sharing=locked \
    JOBS=4 pnpm install --frozen-lockfile --prefer-offline

# Stage 2: Build optimisé
FROM base AS builder
ARG VITE_API_URL=https://api.example.com
ARG VITE_APP_TITLE=TanStack App
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}
ENV NODE_ENV=production

# Copie node_modules depuis deps (plus rapide que réinstaller)
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml vite.config.* tsconfig.json ./
COPY . .

# Build avec cache Vite
RUN --mount=type=cache,target=/app/node_modules/.vite \
    pnpm run build

# Stage 3: Serveur Express avec proxy pour microservices
FROM node:20-alpine AS runner
WORKDIR /app

# Installer les dépendances nécessaires pour le serveur
RUN npm install -g pnpm@9

# Créer package.json pour les dépendances de production avec Hono
RUN echo '{ \
  "name": "tanstack-hono-server", \
  "version": "1.0.0", \
  "type": "module", \
  "main": "server.js", \
  "dependencies": { \
    "hono": "^4.0.0", \
    "@hono/node-server": "^1.8.0" \
  } \
}' > package.json

# Installer les dépendances de production (sans lockfile car package.json généré)
RUN pnpm install --prod

# Copier le serveur Express
COPY --from=builder /app/server.js ./server.js

# Créer utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 appuser nodejs

# Copier les fichiers buildés
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist

# Variables d'environnement
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Variables pour les microservices (à surcharger dans Kubernetes)
ENV VITE_API_URL=http://wayhost.trustmycloud.com
ENV AUTH_SERVICE_URL=http://wayhost.trustmycloud.com:8000
ENV PAYMENT_SERVICE_URL=http://wayhost.trustmycloud.com:8002
ENV SERVER_SERVICE_URL=http://wayhost.trustmycloud.com:8001

# Exposer le port
EXPOSE 3000

# Changer vers l'utilisateur non-root
USER appuser

# Démarrer le serveur Express
CMD ["node", "server.js"]