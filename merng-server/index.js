const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

mongoose.connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB is connected!');
});

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

const app = express();

apolloServer.applyMiddleware({ app });

app.get("/test", (req, res) => {
    const dbReady = mongoose.connection.readyState;
    var dbStatus = -1;
    if (dbReady == 0) {
        dbStatus = 'DISCONNECTED';
    } else if (dbReady == 1) {
        dbStatus = 'CONNECTED';
    } else if (dbReady == 2) {
        dbStatus = 'CONNECTING';
    } else if (dbReady == 3) {
        dbStatus = 'DISCONNECTING';
    } else {
        dbStatus = 'UNKNOWN';
    }
    res.status(200).json({
        message: 'Server is running!',
        dbStatus: dbStatus
    });
});

app.listen({ port: process.env.PORT || 5000 }, () => {
    console.log(`server running as http://localhost:${process.env.PORT || 5000}/graphql`);
});