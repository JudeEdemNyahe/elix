import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    hello: String!
  }

  #Rule 13:Prefix mutation Names with Object for Alphabetical grouping
  type Mutation {
    postCreate(title: String!, content: String!): PostPayload!
  }

  #rule 15:Mutations should provide user business level Errors

  #Rule 1:Describe entity and their relationship
  type Post {
    id: ID!
    title: String!
    content: String!
    createdSt: String!
    published: Boolean!
    user: User!
  }

  #password is excluded, #Rule2-never expose implementation details
  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String
    user: User!
  }

  #error handling and return types
  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post #must be null to avoid error conflictions
  }
`;
