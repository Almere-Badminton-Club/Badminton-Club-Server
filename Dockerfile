FROM node:18-alpine3.14

ARG ENV_FILE=.env.development

WORKDIR /app
COPY package*.json /app/
RUN npm ci --only=production
RUN npm cache clean --force
COPY . /app
COPY ${ENV_FILE} /app/.env

CMD node server.js
EXPOSE 80