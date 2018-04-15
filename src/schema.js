
var { buildSchema } = require('graphql')
//Construct a schema, using GraphQL schema language

function getSchema(){
var schema = buildSchema(`

type Branch{
    id: Int!
    name: String!
    address: String!
    customers: [Customer!]!
}

input CustomerInput {
    name:String!
    address: String
}

type Customer {
    id: Int!
    name: String!
    address: String
}

    type Query{
        getAllCustomers: [Customer]
        getCustomerByID(id:ID!): Customer
        getBranchList: [Branch]
    }

    type Mutation{
        createCustomer(input: CustomerInput!): Customer
        updateCustomer(id: ID!, input: CustomerInput!): Customer
    }
`);

return schema;
}

module.exports = {
    getSchema 
}