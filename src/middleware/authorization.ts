import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "@utils/jwt-verifier";
import config from "@config/constants";
import { Auth0User } from "@types";

export interface IAuthenticatedRequest extends Request {
  auth: Auth0User;
}

function isAuth0User(decoded: any): decoded is Auth0User {
  return decoded && typeof decoded.sub === "string";
}

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = await verifyJwtToken(token);
    console.log(decoded);

    if (!isAuth0User(decoded)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Assign the token payload to req.auth (declared in express module augmentation)
    (req as any).auth = decoded;

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize =
  (roles: string[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as IAuthenticatedRequest).auth;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user info found" });
    }

    const userRoles = user[`${config.auth.namespace}roles`] ?? [];

    if (roles.length > 0 && !roles.some((r) => userRoles.includes(r))) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next();
  };
