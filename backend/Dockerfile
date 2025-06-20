FROM node:20-slim

RUN apt-get update
RUN mkdir backend
WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x exec.sh
RUN npx tsc

EXPOSE 4000-4002

CMD ["./exec.sh"]
