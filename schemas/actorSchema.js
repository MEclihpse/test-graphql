import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { checkParams } from "../helpers/index.js";
import { GraphQLError } from "graphql";

const {
    Actor
} = require("../models/index.cjs");


const typeDefs = `#graphql

    type Actor {
        id: ID
        MovieId: Int
        name: String
        profilePict: String
    }

    type Response {
        response: String
    }

    type Query {
        getActors: [Actor]
        findActorById(id: ID!): Actor
    }

    input ActorInput {
        name: String!
        profilePict: String!
    }

    type Mutation {
        createActor(content: ActorInput, MovieId: ID!): Response
        deleteActorById(id: ID!): Response
    }
`;


const resolvers = {
    Query: {
        getActors: async () => {
            try {
                const data = await Actor.findAll()
                if (!data) {
                    throw {response: 'Actor Not Found'}
                }
                return data
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        },

        findActorById: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.id])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {id} = args
                const data = await Actor.findByPk(id)
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
        createActor: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.MovieId, args.content.name, args.content.profilePict])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {content} = args
                const data = await Actor.create({
                    ...content,
                    MovieId
                })
                if (!data) {
                    throw {response: 'Failed to create Actor'}
                }
                return {response: `Actor has been created`}
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        },

        deleteActorById: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.id])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {id} = args
                const data = await Actor.destroy({
                    where: {
                        id
                    }
                })
                if (!data) {
                    throw {response: `Failed to delete Actor with id ${id}`}
                }
                return {response: `Actor ${id} has been deleted`}
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        }
    }
}

export {typeDefs, resolvers}