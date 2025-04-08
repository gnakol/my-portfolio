# Étape 1 : builder l'app Angular
FROM node:18 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Étape 2 : servir l'app avec Nginx
FROM nginx:alpine

# ✅ Copie les bons fichiers (dans le dossier /browser)
COPY --from=build /app/dist/portfolio-template/browser /usr/share/nginx/html

# Optionnel : config nginx perso
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
