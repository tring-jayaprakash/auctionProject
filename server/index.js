const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const corsConfig = require('./config/corsConfig');
const { PORT, GRAPHQL_PATH } = require('./config/serverConfig');
const schema = require('./graphql/schema');
const root = require('./graphql/root');
const { postgraphile } = require('postgraphile');
require("dotenv").config();

const app = express();
app.use(corsConfig);

app.use(GRAPHQL_PATH, graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// app.use(
//     postgraphile(process.env.DATABASE_URL, "public", {
//       watchPg: true, // Automatically update schema changes
//       graphiql: true, // Enable GraphiQL interface
//       enhanceGraphiql: true, // Better UI for GraphiQL
//       dynamicJson: true, // Return JSON fields as objects
//       enableCors: true, // Allow CORS
//     })
//   );
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
