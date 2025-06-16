FROM node:18 AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --production
COPY . .

FROM node:18-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
CMD ["node", "index.js"]
