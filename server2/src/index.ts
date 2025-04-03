import "reflect-metadata";
import express from "express";
import { AppDataSource } from './db/data-source';
import dotenv from "dotenv";
import { postgraphile } from 'postgraphile';
import { AuthPlugin } from "./user/plugins/AuthPlugin";
import jwt from "jsonwebtoken"

dotenv.config();

const app = express();
app.use(express.json());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE URL is not defined");
}

app.use(
  postgraphile(process.env.DATABASE_URL, "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    enableCors: true,
    appendPlugins: [AuthPlugin], 
    additionalGraphQLContextFromRequest: async (req, res) => {
      const operationName = req.body?.operationName;

      if (operationName === "guest") {
        return { req, res };
      }

      let token: string | undefined;

      if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        console.log("No token provided");
        console.log("--------------------->",res);
        throw new Error("Valid token is required")
      }

      try {
        const decodedUser = jwt.verify(token,process.env.SECRET_KEY!);
        console.log("Authenticated User:", decodedUser);
        return { user: decodedUser, req, res };
      } catch (error: any) {
        console.error("JWT Verification Error:", error.message);
        throw new Error("Invalid user token");
      }
    }
  })
);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });