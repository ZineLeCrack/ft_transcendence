FROM node:18-slim

RUN apt-get update && apt-get install -y openssl php

WORKDIR /app

COPY package*.json ./
RUN npm install
run npm install -g typescript

COPY . .
RUN chmod +x exec.sh
RUN npx tsc -p server_local
RUN npx tsc -p server_multi

EXPOSE 4000-4001

CMD ["./exec.sh"]
