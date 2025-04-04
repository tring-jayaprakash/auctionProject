import "reflect-metadata";
import express from "express";
import { AppDataSource } from './db/data-source';
import dotenv from "dotenv";
import { postgraphile } from 'postgraphile';
import { AuthPlugin } from "./user/plugins/AuthPlugin";
import { additionalGraphQLContextFromRequest } from "./utils/authContext"; 
import { AuctionPlugin } from "./auctionModule/plugins/AuctionPlugin";

dotenv.config();

const app = express();
app.use(express.json());


app.use(
  postgraphile(process.env.DATABASE_URL, "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    enableCors: true,
    appendPlugins: [AuthPlugin, AuctionPlugin],
    additionalGraphQLContextFromRequest,
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