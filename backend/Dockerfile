FROM node:18-slim

RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY tools/users.sql .
COPY tools/chat.sql .

RUN sqlite3 user.db < users.sql
RUN sqlite3 chat.db < chat.sql

CMD ["tail", "-f", "/dev/null"]



 