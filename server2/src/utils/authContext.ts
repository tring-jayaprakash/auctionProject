import jwt from "jsonwebtoken"
import { Request, Response } from "express";
export const additionalGraphQLContextFromRequest = async (req: Request, res: Response) => {

  const operationName = req.body?.operationName;

  if (operationName === "guest") {
    return { req, res };
  }

  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new Error("Valid token is required")
  }

  try {
    const decodedUser = jwt.verify(token, process.env.SECRET_KEY!);
    return { user: decodedUser, req, res };
  } catch (error: any) {
    console.error("JWT Verification Error:", error.message);
    throw new Error("Invalid user token");
  }
}