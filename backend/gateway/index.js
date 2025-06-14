const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const jwt = require('jsonwebtoken');
const config = require('./gateway.config');

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

async function startGateway() {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: config.serviceList,
    }),
  });

  const server = new ApolloServer({
    gateway,
    introspection: true,
  });
  await server.start();

  const app = express();
  app.use(express.json());

  // Basic JWT auth middleware
  app.use((req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('Missing JWT');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      console.log('JWT validation failed:', err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  });

  app.use('/graphql', expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Gateway running at http://localhost:${PORT}/graphql`);
  });
}

startGateway();
