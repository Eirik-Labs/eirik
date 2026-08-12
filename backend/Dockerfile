FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci      #installs dependencies from package-lock.json

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]