const { ApolloServer, gql } = require("apollo-server-micro");
const cors = require("micro-cors")();
const { send } = require("micro");
const {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

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
  const handler = server.createHandler({ path: "/api/graphql" });
  return cors((req, res) => {
    return req.method === "OPTIONS" ? send(res, 200, "ok") : handler(req, res);
  });
  // return server.createHandler({ path: "/api/graphql" });
});
