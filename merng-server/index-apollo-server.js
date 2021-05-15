//Use Apollo Server without Express Middleware

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

server.listen({ port: process.env.PORT || 6000 })
    .then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });