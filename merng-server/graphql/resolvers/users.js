const User = require('../../models/User');
const { hash, compare } = require('bcryptjs');
const sign = require('jsonwebtoken/sign');
const checkAuth = require('../../utilities/auth');

const { UserInputError, AuthenticationError } = require('apollo-server-errors');

const generateToken = (dbObject) => {
    return sign({
        id: dbObject.id,
        email: dbObject.email,
        username: dbObject.username
    }, process.env.SECRET_KEY, {
        expiresIn: '1h'
    });
};

module.exports = {
    Query: {
        getUsers: async (_, { }, context) => {
            const user = checkAuth(context);
            try {
                const userData = User.findById(user.id);
                if (userData) {
                    const userList = await User.find().sort({ createdAt: -1 });
                    return userList;
                } else {
                    throw AuthenticationError("Token is invalid!");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        getUser: async (_, { userId }, context) => {
            const user = checkAuth(context);
            try {
                const userData = User.findById(user.id);
                if (userData) {
                    const userFromDb = await User.findOne({ _id: userId });
                    if (userFromDb) {
                        return userFromDb;
                    } else {
                        throw new Error('User not found!');
                    }
                } else {
                    throw AuthenticationError("Token is invalid!");
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    },

    Mutation: {
        register: async (_, args, context, info) => {

            let {
                registerInput: { name, email, username, password, confirmPassword },
            } = args;

            const exisitingUsername = await User.findOne({ username: username });
            if (exisitingUsername) {
                throw new UserInputError("Username already exists.", {
                    errors: {
                        username: "\'" + username + "\' is already taken."
                    }
                });
            }

            const exisitingEmail = await User.findOne({ email: email });
            if (exisitingEmail) {
                throw new UserInputError("Email is already used.", {
                    errors: {
                        email: "\'" + email + "\' is already used."
                    }
                });
            }

            password = await hash(password, 12);

            const newUser = new User({
                name,
                username,
                password,
                email,
                createdAt: new Date().toString(),
            });

            const addUser = await newUser.save();

            try {
                const token = generateToken(addUser);

                return {
                    id: addUser.id,
                    ...addUser._doc,
                    token,
                };
            } catch (error) {
                throw new Error('Unable to generate token');
            }
        },

        login: async (_, args, context, info) => {
            let {
                loginInput: { username, password }
            } = args;

            const existingUser = await User.findOne({ username });

            if (!existingUser) {
                throw new UserInputError('User is not found', { login: "Invalid username/password." });
            }

            const verified = await compare(password, existingUser.password);
            if (!verified) {
                throw new UserInputError('Invalid Credentials', { login: "Invalid username/password." });
            }

            const token = generateToken(existingUser);

            return {
                ...existingUser._doc,
                id: existingUser.id,
                token,
            };
        },
    }
};