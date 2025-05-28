FROM node:18-slim

RUN apt-get update && apt-get install -y openssl php

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x exec.sh
RUN npx tsc

EXPOSE 4000-4001

CMD ["./exec.sh"]
