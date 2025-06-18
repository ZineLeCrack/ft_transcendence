FROM node:20-slim

RUN apt-get update && apt-get install -y sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir database
RUN mkdir database_file

WORKDIR /database_file

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc

RUN sqlite3 ../database/users.db < tools/users.sql
RUN sqlite3 ../database/chat.db < tools/chat.sql
RUN sqlite3 ../database/tournaments.db < tools/tournaments.sql

EXPOSE 3451

CMD ["node", "server_api.js"]