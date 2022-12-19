import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query } from "./resolvers/index";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const resolvers = {
  Query,
};
const context = {
  prisma,
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`Server ready on ${url}`);
});
