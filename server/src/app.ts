import { resolve } from 'path';
import { createServer } from '@graphql-yoga/node';

let messages:any[] = [] ;

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
    }
    type Query {
        messages: [Message!]
    }
    type Mutation{
        postMessage(user: String!, content: String!): ID!
    }
`;

const resolvers = {
    Query: {
        messages: () => messages, 
    },
    Mutation: {
        postMessage:(_parent : any, {user, content}:any) => {
            const id = messages.length ;
            messages.push({
                id, 
                user, 
                content
            })
            return id ; 
        }
    }
}


// Create your server
const server = createServer({
    schema: {
        typeDefs,
        resolvers
    }
})
// start the server and explore http://localhost:4000/graphql
server.start()