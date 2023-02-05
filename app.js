// const express = require('express');
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as movie from "./schemas/movieSchema.js"
import * as author from "./schemas/authorSchema.js"
import * as actor from "./schemas/actorSchema.js"

const server = new ApolloServer({
  typeDefs: [author.typeDefs, movie.typeDefs, actor.typeDefs],
  resolvers: [author.resolvers, movie.resolvers, actor.resolvers],
  introspection: true,
  playground: true
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ token: req.headers.token }),
  listen: { port: 4000 },
});
console.log(`🚀  Server ready at ${url}`);