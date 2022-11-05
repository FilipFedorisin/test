FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json next.config.js .env .npmrc .nvmrc postcss.config.js tailwind.config.js ./
COPY src ./src
COPY public ./public

CMD ["npm", "run","dev"]