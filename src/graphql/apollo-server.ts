import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import baseSchema from "@graphql/schema";
import { permissions } from "@middleware/graphql-authorization";
import { verifyJwtToken } from "@utils/jwt-verifier";
import { Auth0User } from "@types";

const schemaWithMiddleware = applyMiddleware(baseSchema, permissions);

export function createApolloServer() {
  return new ApolloServer({
    schema: schemaWithMiddleware,
    introspection: true,
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

      if (!token) {
        throw new AuthenticationError(
          "Missing Authorization token. Please include a valid JWT in the Authorization header using the format → 'authorization': 'Bearer <your_token>'.",
        );
      }

      try {
        const decoded = await verifyJwtToken(token);
        const user = decoded as Auth0User;
        return { user };
      } catch (err) {
        throw new AuthenticationError("Invalid or expired token");
      }
    },
  });
}
