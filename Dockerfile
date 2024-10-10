FROM node:18-alpine3.14
WORKDIR /app
COPY package*.json /app/
RUN npm ci --only=production
RUN npm cache clean --force
COPY . /app

CMD node server.js
EXPOSE 80