FROM node:18-slim

RUN apt-get update && apt-get install -y \
    sqlite3 npm\
    && rm -rf /var/lib/apt/lists/*

RUN mkdir database

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc

RUN sqlite3 database/user.db < tools/users.sql
RUN sqlite3 database/chat.db < tools/chat.sql

EXPOSE 3451

CMD ["node", "server_api.js"]