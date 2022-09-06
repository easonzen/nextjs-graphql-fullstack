import { ApolloServer, gql } from "apollo-server-micro";
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";

import Cors from "micro-cors";
// import { send } from "micro";

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      : ApolloServerPluginLandingPageLocalDefault({
          footer: false,
          embed: true,
        }),
  ],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});
