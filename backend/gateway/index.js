const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const typeDefs = `#graphql
  type KPI { name: String! value: Float! trend: String unit: String }
  type ChartConfig { type: String! title: String xAxis: String yAxis: String }
  type Dataset { recommendedCharts: [ChartConfig!]! }
  type School { id: ID! name: String! kpis: [KPI!]! datasets: Dataset }
  type Recommendation { type: String! new_fte: Float! }
  type OptimizationOutput { recommendations: [Recommendation!]! total_cost: Float! }
  type Violation { type: String! message: String! }
  type SimulationResult { valid: Boolean! violations: [Violation!]! }

  type Query {
    health: String!
    school(id: ID!): School
    compareSchools(ids: [ID!]!): [School!]!
  }

  input PositionInput { type: String! fte: Float! cost: Float! }
  input OptimizationInput {
    school_id: String!
    budget: Float!
    students: Int!
    positions: [PositionInput!]!
    special_ed_students: Int!
  }
  input SimulationInput {
    school_id: String!
    budget: Float!
    students: Int!
    positions: [PositionInput!]!
    special_ed_students: Int!
  }

  type Mutation {
    login(username: String!, password: String!): String!
    generateReport(htmlContent: String!): String!
    optimize(input: OptimizationInput!): OptimizationOutput!
    simulate(input: SimulationInput!): SimulationResult!
  }
`;

const schools = [
  {
    id: '1',
    name: 'School A',
    kpis: [
      { name: 'Cost per student', value: 92000, unit: 'NOK', trend: 'up' },
      { name: 'Trivsel', value: 4.3, unit: 'score', trend: 'up' },
    ],
    datasets: { recommendedCharts: [] },
  },
  {
    id: '2',
    name: 'School B',
    kpis: [
      { name: 'Cost per student', value: 107000, unit: 'NOK', trend: 'down' },
      { name: 'Trivsel', value: 3.7, unit: 'score', trend: 'down' },
    ],
    datasets: { recommendedCharts: [] },
  },
];

const resolvers = {
  Query: {
    health: () => 'ok',
    school: (_, { id }) => schools.find((s) => s.id === id) || null,
    compareSchools: (_, { ids }) => schools.filter((s) => ids.includes(s.id)),
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const res = await fetch('http://auth-service:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      return data.token;
    },
    generateReport: async (_, { htmlContent }) => {
      const res = await fetch('http://pdf-service:8000/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlContent }),
      });
      if (!res.ok) throw new Error('PDF failed');
      const data = await res.json();
      return `data:application/pdf;base64,${data.pdf}`;
    },
    optimize: async (_, { input }) => {
      const res = await fetch('http://optimization-service:8000/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Optimize failed');
      return await res.json();
    },
    simulate: async (_, { input }) => {
      const res = await fetch('http://simulation-service:8000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Simulate failed');
      return await res.json();
    },
  },
};

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/graphql', async (req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    if (req.body.operationName === 'login') {
      return expressMiddleware(server)(req, res, next);
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      jwt.verify(token, JWT_SECRET);
      return expressMiddleware(server)(req, res, next);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Gateway running at http://localhost:${PORT}/graphql`);
  });
}

start();
