FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

# No copiamos el código aquí, ya que usaremos volúmenes

EXPOSE 3000

CMD ["npm", "start"]
