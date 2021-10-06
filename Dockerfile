FROM node:16.3-alpine3.11

WORKDIR /usr/source/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node","app.js"]