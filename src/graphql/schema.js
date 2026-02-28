import { gql } from 'apollo-server-express'

/**
 * The GraphQl schema definition.
 * Defines all types, queries and mutations for the API.
 */
export const typeDefs = gql`
  type Game {
    id: ID!
    name: String!
    platform: String!
    year: Int
    genre: String!
    publisher: publisher
    naSales: Float
    euSales: Float
    jpSales: Float
    otherSales: Float
    globalSales: Float
  }
  
  type Publisher {
    id: ID!
    name: String!
    totalGames: Int
    totalGlobalSales: Float
  }

  type platform {
    id: ID!
    name: String!
    totalGames: Int
    genres: [String]
    releaseYears: [Int]
  }

  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type GameList {
    games: [Game!]!
    totalCount: Int!
  }

  type PublisherList {
    publishers: [Publisher!]!
    totalCount: Int!
  }

  type PlatformList {
    platforms: [Platform!]!
    totalCount: Int!
  }

  type Query {
    games(
      genre: String
      platform: String
      year: Int
      limit: Int
      offset: Int
    ): GameList!

    game(id: ID!): Game

    publishers(
      limit: Int
      offset: Int
    ): PublisherList!

    publisher(id: ID!): Publisher

    platforms(
      limit: Int
      offset: Int
    ): PlatformList

    platform(id: ID!): Platform
  }

  type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    createGame(
      name: String!
      platform: String!
      year: Int
      genre: String!
      publisherId: ID!
      naSales: Float
      euSales: Float
      jpSales: Float
      otherSales: Float
      globalSales: Float
    ): Game!

    updateGame(
      id: ID!
      name: String
      platform: String
      year: Int
      genre: String
      publisherId: ID
      naSales: Float
      euSales: Float
      jpSales: Float
      otherSales: Float
      globalSales: Float
    ): Game!

    deleteGame(id: ID!): Boolean!
  }
`