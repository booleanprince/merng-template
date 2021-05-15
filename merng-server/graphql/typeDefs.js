const { gql } = require('apollo-server');

module.exports = gql`
    #Type Definitions for establishing GraphQL Schema
    #TypeDefs define the structure of the data that clients can query

    type User {
        id: ID!
        name: String!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        name: String!
        email: String!
        username: String!
        password: String!
        confirmPassword: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    #Queries in the API
    type Query {
        getUsers: [User]
        getUser(userId: ID!): User
    }

    #Mutations in the API
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(loginInput: LoginInput): User!
    }
`;