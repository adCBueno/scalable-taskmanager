FROM node:24-alpine
WORKDIR /app
COPY . . 
RUN npm ci --omit=dev
COPY app.js server.js ./
EXPOSE 3002
CMD ["npm", "start"]