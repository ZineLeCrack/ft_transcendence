FROM node:18-slim

RUN apt-get update && apt-get install -y openssl php

WORKDIR /app

COPY package*.json ./
RUN npm install
run npm install -g typescript

COPY . .
RUN chmod +x exec.sh

EXPOSE 3000-3050
EXPOSE 4000

CMD ["./exec.sh"]
