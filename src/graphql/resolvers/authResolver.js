import { AuthService } from '../../services/AuthService.js'
import { UserRepository } from '../../repositories/UserRepository.js'

const userRepository = new UserRepository()
const authService = new AuthService(userRepository)

/**
 * The GraphQL resolvers for authentication operations.
 * Handles user registration and login mutations.
 */
export const authResolver = {
  Mutation: {
    /**
     * Registers a new user and returns a JWT token.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The mutation arguments.
     * @returns {Promise<AuthPayload>}
     */
    register: async(_, { username, password }) => {
      const user = await authService.register(username, password)
      const token = await authService.login(username, password)
      return { token, user }
    },

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The mutation arguments.
     * @returns {Promise<AuthPayload>}
     */
    login: async (_, { username, password }) => {
      const token = await authService.login(username, password)
      const user = await userRepository.findByUsername(username)
      return { token, user }
    }
  }
}