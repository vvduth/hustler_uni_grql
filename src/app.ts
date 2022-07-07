import express from "express";
import { graphqlHTTP } from "express-graphql";

const app = express() ; 

app.use('/graphql', graphqlHTTP({
    schema, 
    graphiql: true
}))

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
})