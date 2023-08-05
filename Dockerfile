FROM node:20.0.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
