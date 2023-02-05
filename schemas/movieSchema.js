import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { checkParams } from "../helpers/index.js";
import { GraphQLError } from "graphql";
const {
    Movie, Actor, sequelize
} = require('../models/index.cjs');
// import db from "../models/index.cjs";

const typeDefs = `#graphql

    type Movie {
        id: ID,
        title: String
        slug: String
        synopsis: String
        trailerUrl: String
        imgUrl: String
        rating: Int
        AuthorId: Int
        Actors: [Actor]
    }

    type Actor {
        id: ID
        MovieId: Int
        name: String
        profilePict: String
    }

    type Response {
        response: String
    }

    input MovieContent {
        title: String!
        synopsis: String!
        trailerUrl: String!
        imgUrl: String!
        rating: Int!
        AuthorId: Int!
        listActors: [listActorsContent]
    }

    input listActorsContent {
        name: String
        profilePict: String
    }

    type Query {
        getMovies: [Movie]
        readSingleMov(id: ID!): Movie
    }

    type Mutation {
        addMov(content: MovieContent): Response 
        editMov(content: MovieContent, id: ID!): Response
        deleteMov(id: ID!): Response
    }

`

const resolvers = {
    Query: {
        getMovies: async () => {
            try {
                const data = await Movie.findAll({
                        include: Actor
                })
                if (!data) throw {response: `Movie Not Found`};
                return data
            } catch (err) {
                console.log(err)
                throw new GraphQLError(err.response)
            }
        },
        readSingleMov: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.id])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {id} = args
                const data = await Movie.findByPk(id, {
                    include: Actor
                })
                if (!data) {
                    throw {response: `Movie Not Found`}
                }
                return data
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        }
    },

    Mutation: {
        addMov: async (_, args) => {
            const t = await sequelize.transaction();
            try {
                const {content} = args
                const fieldCheck = checkParams([
                    content.title, 
                    content.synopsis,
                    content.trailerUrl,
                    content.imgUrl,
                    content.rating,
                    content.AuthorId
                ])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {
                    title, 
                    synopsis, 
                    trailerUrl, 
                    imgUrl, 
                    rating, 
                    listActors,
                    AuthorId
                } = content
            
                const addedMovies = await Movie.create({
                    title, 
                    synopsis, 
                    trailerUrl, 
                    imgUrl, 
                    rating, 
                    AuthorId,
                }, {
                    transaction: t
                })
            
                if (listActors.length) {
                    listActors.forEach(el => el.MovieId = addedMovies.id);
                
                    const addedActors = await Actor.bulkCreate(listActors, {
                        transaction: t
                    })
                }
                t.commit()
                return {response: `Movie and Actors has been added`};
            } catch (err) {
                t.rollback()
                throw new GraphQLError(err.response)
            }
        },
        editMov: async (_, args) => {
            try {
                const {id, content} = args
                const fieldCheck = checkParams([
                    args.id,
                    content.title,
                    content.synopsis,
                    content.trailerUrl,
                    content.imgUrl,
                    content.rating,
                    content.AuthorId
                ])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const data = await Movie.update({
                    ...content
                }, {
                    where: {
                        id
                    }
                })
                if(!data) throw {response: `Movie Not Edited`};
                return {response: `Movie has been updated`};
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        },
        deleteMov: async (_, args) => {
            try {
                const fieldCheck = checkParams([args.id])
                if (!fieldCheck) {
                    throw {response: 'Incomplete Params'}
                }
                const {id} = args
                const data = await Movie.destroy({where: {id}})
                if(!data) throw {response: `Movie Not Deleted`};
                return {response: `Movie has been deleted`};
            } catch (err) {
                console.log(err);
                throw new GraphQLError(err.response)
            }
        }
    }
}

export {typeDefs, resolvers}
