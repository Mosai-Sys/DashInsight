import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Allow overriding the GraphQL endpoint at build time via VITE_GRAPHQL_URL
const uri = import.meta.env.VITE_GRAPHQL_URL || '/graphql';

const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});

export default client;
