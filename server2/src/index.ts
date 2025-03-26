import "reflect-metadata";
import express from "express";
import { AppDataSource } from './db/data-source';
import { Repository } from "typeorm";
import dotenv from "dotenv";
import { postgraphile } from 'postgraphile';
import { AuthPlugin } from "./user/plugins/AuthPlugin";
import jwt from "jsonwebtoken"
import { AuctionPlugin } from "./auctionModule/plugins/AuctionPlugin";

dotenv.config();

const app = express();
app.use(express.json());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}



app.use(
  postgraphile(process.env.DATABASE_URL, "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    enableCors: true,
    appendPlugins: [AuthPlugin,AuctionPlugin],
    additionalGraphQLContextFromRequest: async (req) => {
      // console.log("request,",req.headers.authorization);
      console.log("request operation", req?.body?.operationName);

      const authHeader = req.headers.authorization || "";
      const token = authHeader.split(" ")[1];

      if (!token) return {
        user: null
      };

      try {
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY!);
        // console.log(process.env.SECRET_KEY);
        // console.table(decodedUser);
        return { user: decodedUser };
      } catch (err) {
        return { user: null };
      }
    },
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