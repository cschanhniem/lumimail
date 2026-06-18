FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY src/ ./src/

EXPOSE 143 993 587

CMD ["node", "src/index.js"]
