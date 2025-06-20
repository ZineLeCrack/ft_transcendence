FROM node:20-slim

RUN apt update && apt install -y nginx openssl && rm -rf /var/lib/apt/lists/*

RUN mkdir /certs && \
    openssl req -x509 -nodes -days 365 \
    -subj "/C=FR/ST=Paris/L=Paris/O=42/CN=ft_babyfoot.42.fr" \
    -newkey rsa:2048 \
    -keyout /certs/transcend.key \
    -out /certs/transcend.crt

COPY tools_docker/default.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

RUN mkdir frontend
WORKDIR /frontend
COPY . .

RUN npm install

# Build Vite
RUN npm run build

RUN mkdir -p /var/www/html && cp -r dist/* /var/www/html/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
