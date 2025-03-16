const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const corsConfig = require('./config/corsConfig');
const { PORT, GRAPHQL_PATH } = require('./config/serverConfig');
const schema = require('./graphql/schema');
const root = require('./graphql/root');

const app = express();

app.use(corsConfig);

app.use(GRAPHQL_PATH, graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
