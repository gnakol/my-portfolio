# ---- Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Déps d'abord (cache optimal)
COPY package*.json ./
RUN npm ci

# Puis le code
COPY . .
# Angular >= v12 : plus de --prod, la conf prod se gère dans package.json
RUN npm run build

# ---- Runtime stage
FROM nginx:alpine
# Adapter si nécessaire le nom du projet (angular.json -> "outputPath")
COPY --from=build /app/dist/portfolio-template/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
