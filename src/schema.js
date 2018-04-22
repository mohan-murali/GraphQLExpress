const {
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull 
} = require('graphql');

//Construct a schema, using GraphQL schema language
const customerList = require('./customerList.js')
const branchesList = require('./branchesList.js')
let customerID = 4;

const BranchType = new GraphQLObjectType({
    name: 'Branch',

    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve: (root) => {
                let resultList = [];
                for(let i=0; i< customerList.length; i++){
                    if(customerList[i].branchId == root.id){
                        resultList.push(customerList[i]);
                    }
                }
                return resultList;
            }
        }
    })
});

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    description: '...',

    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) } ,
        address: { type: new GraphQLNonNull(GraphQLString)} ,
        branchId: { type: new GraphQLNonNull(GraphQLInt) } ,
        branch: {
            type: BranchType,
            resolve: (root) => {
                for (let i=0; i< branchesList.length; i++){
                    if(branchesList[i].id == root.branchId){
                        return branchesList[i];
                    }
                }
            }
        }
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: ()=>({
        getCustomerByID: {
            type: CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (root, args)=>{
                for(let i =0; i< customerList.length; i++){
                    if(customerList[i].id == args.id){
                        return customerList[i];
                    }
                }
    
                throw new Error('customer not found for the id: '+ args.id)
            }
        },
        getAllCustomers: {
            type: new GraphQLList(CustomerType),
            resolve: ()=>{
                return customerList;
            }
        },
        getAllBranches:{
            type: new GraphQLList(BranchType),
            resolve: ()=>{
                return branchesList;
            }
        }
    })
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Sample Mutation examples',

    fields: ()=> ({
        createCustomer:{
            type: CustomerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                branchId: { type: new GraphQLNonNull(GraphQLInt) } 
            },

            resolve: (root, args)=> {
                customerID++;
                const customer = {
                    id: customerID,
                    name: args.name,
                    address: args.address,
                    branchId: args.branchId
                }
                customerList.push(customer);
                return customer;
            }
        }
    })
})

module.exports = {
    schema: new GraphQLSchema({
        query: QueryType,
        mutation: MutationType
    })
}