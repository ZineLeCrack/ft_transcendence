FROM node:18-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc -p server

EXPOSE 3000-3100
EXPOSE 3451
EXPOSE 4000

CMD ["node", "server/main_server.js"]
