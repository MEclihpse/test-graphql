import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { checkParams } from "../helpers/index.js";
import { GraphQLError } from "graphql";

const {
    Author
} = require("../models/index.cjs");


const typeDefs = `#graphql

    type Author {
        id: ID
        email: String
    }

    type Response {
        response: String
    }

    type Query {
        getAuthors: [Author]
        findAuthorById(id: ID!): Author
    }

    input AuthorInput {
        email: String!
        password: String!
    }

    type Mutation {
        createAuthor(content: AuthorInput): Response
        deleteAuthorById(id: ID!): Response
    }
`;


const resolvers = {
    Query: {
        getAuthors: async () => {
            try {
                const data = await Author.findAll()
                if (!data) {
                    throw {response: 'Author Not Found'}
                }
                return data
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        },

        findAuthorById: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.id])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {id} = args
                const data = await Author.findByPk(id)
                if (!data) {
                    throw {response: 'Author Not Found'}
                }
                return data
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        }
    },

    Mutation: {
        createAuthor: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.content.email, args.content.password])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {content} = args
                const data = await Author.create({
                    ...content
                })
                if (!data) {
                    throw {response: 'Failed to create author'}
                }
                return {response: `Author has been created`}
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        },

        deleteAuthorById: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.id])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {id} = args
                const data = await Author.destroy({
                    where: {
                        id
                    }
                })
                if (!data) {
                    throw {response: `Failed to delete author with id ${id}`}
                }
                return {response: `Author ${id} has been deleted`}
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        }
    }
}

export {typeDefs, resolvers}