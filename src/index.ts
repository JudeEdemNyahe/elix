import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query, Mutation, Profile, Post, User } from "./resolvers/index";
import { Prisma, PrismaClient } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}

const resolvers = {
  Query,
  Mutation,
  Profile,
  Post,
  User,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization);
    return {
      prisma,
      userInfo,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready on ${url}`);
});
