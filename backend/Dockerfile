FROM node:18-slim

RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev openssl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc -p server

RUN sqlite3 user.db < tools/users.sql
RUN sqlite3 chat.db < tools/chat.sql

EXPOSE 3000
CMD ["node", "server/server.js"]
