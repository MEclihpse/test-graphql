import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import * as movie from "./schemas/movieSchema.js"
import * as author from "./schemas/authorSchema.js"
import * as actor from "./schemas/actorSchema.js"

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: [author.typeDefs, movie.typeDefs, actor.typeDefs],
    resolvers: [author.resolvers, movie.resolvers, actor.resolvers],
    introspection: true,
    playground: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);