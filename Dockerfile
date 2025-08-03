FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY public ./public
COPY vite.config.* tsconfig*.json ./
COPY src ./src
RUN npm run build    
FROM nginx:1.27-alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
