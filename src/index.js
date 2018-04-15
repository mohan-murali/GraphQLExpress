var express = require('express');
var graphqlHTTP = require('express-graphql');
var { getSchema } = require('./schema.js')
var { getRoot } = require('./resolver.js')

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: getSchema(),
    rootValue: getRoot(),
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API at localhost:4000/graphql')