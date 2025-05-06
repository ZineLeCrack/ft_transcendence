FROM node:18-slim

RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY tools/users.sql .

RUN sqlite3 ma_base.db < users.sql

CMD ["tail", "-f", "/dev/null"]



 