# Utilisez une image Node.js Alpine comme base
FROM node:lts-slim

# Créez et définissez le répertoire de travail dans le conteneur
WORKDIR /

# Copiez le fichier package.json et package-lock.json (si existant)
COPY package*.json ./

# Installez les dépendances
RUN npm install

RUN npm install -g nodemon
# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel l'application écoute
EXPOSE 3001

# Commande pour démarrer l'application
CMD ["nodemon", "server"]