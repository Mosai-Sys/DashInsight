FROM node:18
WORKDIR /app

# install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm install --production

# copy source
COPY . .

# run the Node gateway
CMD ["node", "index.js"]
