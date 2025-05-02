FROM node:18-slim

RUN apt update && apt install -y nginx openssl && \
    mkdir -p /etc/ssl/private && \
    openssl req -x509 -nodes -days 365 \
      -subj "/C=FR/ST=Paris/L=Paris/O=42/CN=lelanglo.42.fr" \
      -newkey rsa:2048 \
      -keyout /etc/ssl/private/transcend.key \
      -out /etc/ssl/private/transcend.crt

COPY default.conf /etc/nginx/sites-available/default

CMD ["nginx", "-g", "daemon off;"]
