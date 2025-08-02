# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# código fuente
COPY index.html ./
COPY public ./public
COPY vite.config.* tsconfig*.json ./
COPY src ./src

# genera /app/dist
RUN npm run build      # script "build": "vite build"

# ---------- deploy stage ----------
FROM nginx:1.27-alpine AS prod
# copia la SPA compilada
COPY --from=build /app/dist /usr/share/nginx/html
# (opcional) tu nginx.conf si quieres forzar fallback a index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
