# Gateway Service

This service stitches together all backend GraphQL subgraphs into one endpoint at `/graphql` using **Apollo Gateway**.

```
 auth-service          profiling-service          vismagi-service
      \                       |                       /
       \                      |                      /
  optimization-service   simulation-service    pdf-service
            \               |                /
              ------------ gateway ------------
                         |
                   frontend client
```

Each request is checked for a valid JWT before being passed to the federated schema.

## Running locally

```bash
cd backend/gateway
npm install
npm start
```

The gateway will start on port `8000` by default.

## Environment variables

Copy `.env.example` to `.env` and set `PORT` if you need a different port.
Start the gateway with:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --env-file .env
```

## Federated services

- `http://auth-service:8000/graphql`
- `http://profiling-service:8000/graphql`
- `http://vismagi-service:8000/graphql`
- `http://optimization-service:8000/graphql`
- `http://simulation-service:8000/graphql`
- `http://pdf-service:8000/graphql`

## Example query

```graphql
query {
  me {
    id
    username
  }
}
```

Introspection is enabled so you can explore the schema at `http://localhost:8000/graphql`.
