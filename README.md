# E-Commerce Node.js - TypeScript

## Overview

E-Commerce Node.js - TypeScript is an online store application that allows users to buy and sell products. It is built using Node.js, Express, and MongoDB, with GraphQL powering the API layer. The app includes secure authentication, product management, cart functionality, and role-based access control.

## Features

- 🔐 Auth0-based JWT authentication
- 🧾 GraphQL API (Apollo Server)
- 🛡 Role-based permissions using `graphql-shield`
- 🛍 Full product and cart system
- 🧪 Embedded GraphiQL interface
- 📘 Swagger documentation for REST endpoints

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (version 4.0 or higher)

## Tech Stack

**Server:** Node.js, Express, GraphQL (Apollo Server), Auth0, JWT, graphql-shield, Mongoose, Swagger

## Installation

```bash
yarn install
```

or

```bash
yarn
```

## Setup Environment

Create a `.env` file in the root with your environment variables:

```bash
touch .env
```

Example variables:

```env
MONGODB_URI=mongodb://localhost:27017/your-db
AUTH0_DOMAIN=...
AUTH0_CLIENT_ID=...
AUTH0_AUDIENCE=...
JWT_SECRET=...
CORS_ORIGINS=...
PORT=...
```

## Run Locally

Start the development server:

```bash
yarn run dev
```

Start the server in production mode:

```bash
yarn run start
```

## GraphQL Playground (GraphiQL)

After starting the server, access the embedded GraphiQL interface at:

```
http://localhost:{PORT}/graphiql
```

### 🔐 Authorization Required

All GraphQL queries and mutations require a valid JWT in the `Authorization` header:

```json
{
  "Authorization": "Bearer <your_token>"
}
```

If missing, the server will respond with:

```
Missing Authorization token. Please include a valid JWT in the Authorization header using the format → 'authorization': 'Bearer <your_token>'.
```

## Swagger Documentation

The REST endpoints are documented using Swagger.

To generate and view the Swagger docs:

```bash
yarn run swagger
```

Access it at:

```
http://localhost:{PORT}/api-docs
```

## Available Scripts

| Script               | Description                                         |
| -------------------- | --------------------------------------------------- |
| `dev`                | Starts the server in development mode using Nodemon |
| `start`              | Starts the server in production mode                |
| `swagger`            | Generates Swagger documentation                     |
| `format`             | Formats the codebase using Prettier                 |
| `inject-swagger-env` | Injects runtime variables for Swagger               |

## Libraries Used

| Library                               | Description                                              |
| ------------------------------------- | -------------------------------------------------------- |
| `express`                             | Web framework for Node.js.                               |
| `mongoose`                            | MongoDB object modeling tool.                            |
| `graphql`, `apollo-server-express`    | Core GraphQL server integration.                         |
| `graphql-shield`                      | Middleware for declarative permissions.                  |
| `jsonwebtoken`, `jwks-rsa`            | JWT validation and RSA key decoding (Auth0 integration). |
| `dotenv`                              | Loads environment variables from `.env`.                 |
| `swagger-jsdoc`, `swagger-ui-express` | Swagger/OpenAPI doc generation & UI.                     |
| `bcrypt-nodejs`                       | Password hashing.                                        |

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
