FROM node:18-slim

RUN apt-get update && apt-get install -y openssl php

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x exec.sh
RUN npx tsc -p server
run npx tsc -p ai

EXPOSE 3000-3050
EXPOSE 4000

CMD ["./exec.sh"]
