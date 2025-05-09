FROM node:18-slim

RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    openssl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN openssl req -x509 -nodes -days 365 \
    -subj "/C=FR/ST=Paris/L=Paris/O=42/CN=lelanglo.42.fr" \
    -newkey rsa:2048 \
    -keyout server/transcend.key \
    -out server/transcend.crt

RUN npm install typescript

RUN npx tsc -p server
COPY . .

RUN sqlite3 user.db < tools/users.sql
RUN sqlite3 chat.db < tools/chat.sql

EXPOSE 3000

CMD ["node", "server/server.js"]




 