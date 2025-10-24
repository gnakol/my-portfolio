# ---- Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Meilleur cache: d'abord les deps
COPY package*.json ./
RUN npm ci

# Puis le code
COPY . .
# Angular 17/18/19: pas de --prod; on utilise la conf du package.json
RUN npm run build

# ---- Runtime stage
FROM nginx:alpine
# ATTENTION: adapte le nom "portfolio-template" si ton projet Angular a un autre "name" dans angular.json
COPY --from=build /app/dist/portfolio-template/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
