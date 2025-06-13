FROM node:20-slim

# Install nginx and openssl
RUN apt update && apt install -y nginx openssl && rm -rf /var/lib/apt/lists/*

# Certificats auto-signés
RUN mkdir /certs && \
    openssl req -x509 -nodes -days 365 \
    -subj "/C=FR/ST=Paris/L=Paris/O=42/CN=lelanglo.42.fr" \
    -newkey rsa:2048 \
    -keyout /certs/transcend.key \
    -out /certs/transcend.crt

# NGINX config
COPY tools_docker/default.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copie le projet
WORKDIR /app
COPY . .

# Dépendances
RUN npm install

# Build Vite
RUN npm run build

# Copie le build dans le répertoire web
RUN mkdir -p /var/www/html && cp -r dist/* /var/www/html/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
