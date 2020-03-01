var express = require('express');
var graphqlHTTP = require('express-graphql');
var cors = require('cors');
var { schema } = require('./schema.js');

var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API at localhost:4000/graphql')