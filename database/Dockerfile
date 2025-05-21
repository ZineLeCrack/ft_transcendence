FROM node:18-slim

RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir database 
WORKDIR /database

COPY . .

RUN sqlite3 user.db < tools/users.sql
RUN sqlite3 chat.db < tools/chat.sql
RUN chmod +x start.sh

EXPOSE 3451
EXPOSE 3452
EXPOSE 3453

CMD ["./start.sh"]
# CMD ["tail", "-f", "/dev/null"]