import { ApolloServer, gql } from "apollo-server-micro";
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";

import cors from "micro-cors";
import { send } from "micro";

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

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
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

module.exports = server.start().then(() => {
  return cors()((req, res) =>
    req.method === "OPTIONS"
      ? send(res, 200, "ok")
      : server.createHandler({ path: "/api/graphql" })(req, res)
  );
});
