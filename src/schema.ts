import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    Me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }

  #Rule 13:Prefix mutation Names with Object for Alphabetical grouping
  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!): PostPayload!
    postUnpublish(postId: ID!): PostPayload!
    signup(
      credentials: CredentialsInput!
      name: String!
      bio: String!
    ): AuthPayload!
    signin(credentials: CredentialsInput!): AuthPayload!
  }

  #rule 15:Mutations should provide user business level Errors

  #Rule 1:Describe entity and their relationship
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User
  }

  #password is excluded, #Rule2-never expose implementation details
  type User {
    id: ID!
    name: String!
    email: String!
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

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  input CredentialsInput {
    email: String!
    password: String!
  }
`;
