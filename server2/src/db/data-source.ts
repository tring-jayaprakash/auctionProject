import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
// import { withLogging } from "../plugins/myPlugin";

// const dataSourceOptions: DataSourceOptions = {
//   type: "postgres",  
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "1234",
//   database: "auction",
//   synchronize: false,  
//   logging: false,
//   entities: ["src/entities/**/*.ts"],
//   migrations: ["src/db/migrations/**/*.ts"],
//   subscribers: ["src/subscriber/**/*.ts"]
// };



// const enhancedDataSourceOptions: DataSourceOptions = withLogging(dataSourceOptions);

// export const AppDataSource = new DataSource(enhancedDataSourceOptions);


export const AppDataSource = new DataSource({

  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "auction",
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/db/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"]
});


AppDataSource.initialize()
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch((error) => console.log("Database Connection Failed!", error));


// import 'reflect-metadata'
// import { DataSource } from 'typeorm'
// import dotenv from "dotenv";

// dotenv.config()

// export const AppDataSource = new DataSource({

//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "1234",
//   database: "auction",
//   synchronize: false,
//   logging: false,
//   entities: ["src/entities/**/*.ts"],
//   migrations: ["src/db/migrations/**/*.ts"],
//   subscribers: ["src/subscriber/**/*.ts"]
// });
