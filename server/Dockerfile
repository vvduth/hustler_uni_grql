FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install && npm install typescript -g

COPY . .

RUN tsc

EXPOSE 80

CMD ["node", "dist/app.js"]