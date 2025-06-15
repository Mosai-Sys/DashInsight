FROM node:18

WORKDIR /app

# Install Node dependencies
COPY package.json ./
RUN npm install && npx playwright install --with-deps

COPY . .

# Run the service
CMD ["node", "index.js"]
