FROM node:24-alpine

WORKDIR /app/web-gateway
COPY web-gateway/package.json web-gateway/package-lock.json ./
RUN npm ci --omit=dev
COPY web-gateway/server.js ./

WORKDIR /app/UI
COPY UI/package.json UI/package-lock.json ./
RUN npm ci
COPY UI/ ./
RUN npm run build
RUN cp -r dist /app/web-gateway/public

WORKDIR /app/web-gateway
EXPOSE 3000
CMD ["npm", "start"]