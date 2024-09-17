FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

EXPOSE 5500

CMD ["npm", "start"]
