FROM node:18-slim

RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir database 
WORKDIR /database

COPY . .

RUN sqlite3 user.db < tools/users.sql
RUN sqlite3 chat.db < tools/chat.sql

CMD ["tail", "-f", "/dev/null"]