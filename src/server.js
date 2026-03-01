import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import { typeDefs } from './graphql/schema.js'
import { resolvers } from './graphql/resolvers/index.js'
import { connectDatabase } from './config/database.js'
import { verifyToken } from './middleware/auth.js'

dotenv.config()

/**
 * Initializes and starts the Express and Apollo GraphQL server.
 */
const startServer = async () => {
  const app = express()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    /**
     * Builds the GraphQL context for each request.
     * Attaches the authenticated user to the context if a valid JWT is provided.
     *
     * @param {object} param - The request object.
     * @param {object} param.req - The Express request object.
     * @returns {object} - The GraphQl context.
     */
    context: ({ req }) => {
      const user = verifyToken(req)
      return { user }
    }
  })

  await server.start()
  server.applyMiddleware({ app, path: '/graphql' })

  await connectDatabase(process.env.MONGODB_URI)

  const port = process.env.PORT || 4000

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/graphql`)
  })
}

startServer()