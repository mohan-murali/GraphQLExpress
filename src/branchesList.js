var customerList = require('./customerList.js')

var branchesList = [{
    id:1,
    name: 'Branch 1',
    address: 'Street 1',
    customers: [customerList[0], customerList[1]]
},
{
    id:2,
    name: 'Branch 2',
    address: 'Street 2',
    customers: [customerList[2], customerList[3]]
}]

module.exports = (
    branchesList
)