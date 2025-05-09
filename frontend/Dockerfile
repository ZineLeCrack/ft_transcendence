FROM node:18-slim

RUN apt update && apt install -y nginx openssl

RUN mkdir -p /etc/ssl/private && \
    openssl req -x509 -nodes -days 365 \
    -subj "/C=FR/ST=Paris/L=Paris/O=42/CN=lelanglo.42.fr" \
    -newkey rsa:2048 \
    -keyout /etc/ssl/private/transcend.key \
    -out /etc/ssl/private/transcend.crt

COPY tools_docker/default.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

WORKDIR /app
COPY . .

RUN npm install -D tailwindcss postcss autoprefixer typescript

RUN npx tailwindcss -i ./src/css/input.css -o ./src/css/style.css && npx tsc

COPY . .

RUN mkdir -p /var/www/html && cp index.html /var/www/html && \
    cp -r src/ /var/www/html/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
