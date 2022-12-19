import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query } from "./resolvers/index";
const resolvers = {
  Query,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready on ${url}`);
});
