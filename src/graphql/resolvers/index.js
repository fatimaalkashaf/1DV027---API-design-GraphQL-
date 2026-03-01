import { authResolver } from './authResolver.js'
import { gameResolver } from './gameResolver.js'
import { publisherResolver } from './publisherResolver.js'
import { platformResolver } from './platformResolver.js'

/**
 * The merged resolvers for the GraphQl schema.
 * Combines all resolvers into a single object.
 */
export const resolvers = {
  Query: {
    ...gameResolver.Query,
    ...publisherResolver.Query,
    ...platformResolver.Query
  },
  Mutation: {
    ...authResolver.Mutation,
    ...gameResolver.Mutation
  }
}