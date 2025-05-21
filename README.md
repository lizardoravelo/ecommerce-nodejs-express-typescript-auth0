# E-Commerce Node JS - Typescript

## Overview

E-Commerce Node JS - Typescript is an online store application that allows users to buy and sell products. The project is built using Node.js and Express, with a MongoDB database for data storage. The application supports user authentication, product management, and role-based access control.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (version 4.0 or higher)

## Tech Stack

**Server:** Node, Express, bcrypt-nodejs, JWT, passport, swagger

## Installation

```bash
  yarn install
```

or

```bash
   yarn
```

# Generate ENV file

Add your environment variables (e.g., MongoDB URI, JWT secret) to the .env file.

```bash
   touch .env
```

## Run Locally

Start the development server

```bash
  yarn run dev
```

To start the server in production mode

```bash
  yarn run start
```

## Appendix

Scripts:

- dev: Starts the server in development mode using nodemon.
- start: Starts the server in production mode.
- swagger: Generates Swagger documentation for the API.
- format: Formats the codebase using Prettier.

## Documentation

Swagger documentation is available and can be accessed at /api-docs after starting the server.

# Running Swagger

To read the Swagger documentation:

```bash
    yarn run swagger
```

## Libraries Used

| Library              | Version | Description                                                  |
| -------------------- | ------- | ------------------------------------------------------------ |
| `bcrypt-nodejs`      | ^0.0.3  | Library for hashing passwords.                               |
| `cors`               | ^2.8.5  | Middleware to enable Cross-Origin Resource Sharing.          |
| `dotenv`             | ^16.4.5 | Loads environment variables from a `.env` file.              |
| `express`            | ^4.19.2 | Web framework for Node.js.                                   |
| `http-status`        | ^1.7.4  | Utility to manage HTTP status codes.                         |
| `jsonwebtoken`       | ^9.0.2  | JSON Web Token (JWT) implementation for user authentication. |
| `mongoose`           | ^8.4.3  | MongoDB object modeling tool.                                |
| `passport`           | ^0.7.0  | Authentication middleware for Node.js.                       |
| `passport-jwt`       | ^4.0.1  | Passport strategy for JWT authentication.                    |
| `swagger-jsdoc`      | ^6.2.8  | Generates Swagger documentation from JSDoc comments.         |
| `swagger-ui-express` | ^5.0.1  | Serves Swagger UI for API documentation.                     |

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
