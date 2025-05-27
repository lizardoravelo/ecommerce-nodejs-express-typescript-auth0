import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger";
import cors from "cors";
import config from "./config/constants";
import { router } from "@routes";
import { createApolloServer } from "@graphql/apollo-server";
import path from "path";
import { globalRateLimiter } from "@middleware/rateLimiter";

const app: Application = express();
app.set("trust proxy", 1); // Trust the first proxy (for Heroku or similar environments)

//Listener
const server = app.listen(config.port, () => {
  console.log(`Server connected to port ${config.port}`);
});

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Apollo GraphQL setup
async function startApollo() {
  const apolloServer = createApolloServer();
  await apolloServer.start();

  app.use("/graphql", globalRateLimiter);
  apolloServer.applyMiddleware({ app, path: "/graphql" });
}

startApollo().catch((err) => {
  console.error("Failed to start Apollo Server:", err);
  process.exit(1);
});

app.get("/graphiql", (_req, res) => {
  res.sendFile(path.join(__dirname, "graphiql.html"));
});

// Handling Error
process.on("unhandledRejection", (err: Error) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
