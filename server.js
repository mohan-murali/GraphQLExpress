var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql')

//Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
        getRelatedMessage: String
    }

    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int): [Int]
    }

    type Query{
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
        rollDice(numDice: Int!, numSides: Int): [Int]
        getDie(numSides: Int): RandomDie
        getMessage(id: ID!): Message
    }

    type Mutation{
        setMessage(message: String): String
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`);

class Message {
    constructor(id, {content, author}){
        this.id = id;
        this.content = content;
        this.author = author;
    }

    getRelatedMessage(root){
        console.log("this is the start");
        console.log(root);
        return root.content;
    }
}

class RandomDie{
    constructor(numSides){
        this.numSides = numSides;
    }

    rollOnce(){
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({numRolls}){
        var output = [];
        for(var i=0; i< numRolls; i++){
            output.push(this.rollOnce());
        }
        return output;
    }
}

var createId = 0;
var fakeDatabase = {};

//The root provides a resolver function for each API endpoint
var root  = {
    quoteOfTheDay: ()=> {
        return 'Salvation lies withing';
    },
    random: () => {
        return Math.random();
    },
    rollThreeDice: () => {
        return [1, 2, 3].map(x=> 1 + Math.floor(Math.random() * 6));
    },
    rollDice: (args) => {
        var output = [];
        for(var i = 0; i< args.numDice; i++){
            output.push(1+ Math.floor(Math.random()* (args.numSides|| 6)));
        }
        return output;
    },
    getDie: ({numSides})=> {
        return new RandomDie(numSides || 6);
    },
    setMessage: ({message}) => {
        fakeDatabase.message = message;
        return message;
    },
    getMessage: ({id}) => {
        if(!fakeDatabase[id]){
            throw new Error ('no message exists with id '+ id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage: ({input}) => {
        var id = createId + 1;

        fakeDatabase[id] = input;
        return new Message(id,input);
    },
    updateMessage: ({id, input}) => {
        if(!fakeDatabase[id]){
            throw new Error ('no message exists with id '+ id);
        }

        fakeDatabase[id] = input;
        return new Message(id, input);
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API at localhost:4000/graphql')