var customerList = require('./customerList.js')
var branchesList = require('./branchesList.js')
var customerID = 3;

//The root provides a resolver function for each API endpoint
function getRoot(){
    var root  = {
        getAllCustomers: ()=>{
            return customerList;
        },
        getCustomerByID: ({id}) => {
            for(var i =0; i< customerList.length; i++){
                if(customerList[i].id == id){
                    return customerList[i];
                }
            }

            throw new Error('customer not found for the id: '+ id)
        },
        createCustomer: ({input}) => {
            customerID++;
            const customer = {
            id: customerID,
            name: input.name,
            address: input.address
            }

            customerList.push(customer);
            return customer;
        },
        updateCustomer: (args) => {
            for(var i=0; i< customerList.length; i++){
                if(customerList[i].id == args.id){
                    customerList[i].name = args.input.name;
                    customerList[i].address = args.input.address;
                    return customerList[i];
                }
            }

            throw new Error('customer not found for the id: '+ args.id);
        },
        getBranchList: () => {
            return branchesList;
        }
    };
    return root;
}

module.exports = {
    getRoot
}