//Resolvers dictates how the data of a particular type is fetched
const UserResolvers = require('./users');

module.exports = {
    Query: {
        ...UserResolvers.Query,
    },
    Mutation: {
        ...UserResolvers.Mutation,
    }
};