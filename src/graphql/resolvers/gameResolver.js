import { GameService } from '../../services/GameService.js'
import { GameRepository } from '../../repositories/GameRepository.js'
import { requireAuth } from '../../middleware/auth.js'

const gameRepository = new GameRepository()
const gameService = new GameService(gameRepository)

/**
 * The GraphQl resolvers for Game operations.
 * Handles all game queries and mutations.
 */
export const gameResolver = {
  Query: {
    /**
     * Retrieves all games with optional filtering and pagination.
     *
     * @param {object} _ - The unused parent resolvers.
     * @param {object} args - The query arguments.
     * @returns {Promise<GameList>}
     */
    games: async (_, { genre, platform, year, limit, offset }) => {
      return gameService.getGames({ genre, platform, year, limit, offset })
    },

    /**
     * Retrieves a single game by its ID.
     *
     * @param {object} _ - The unused parent resolvers.
     * @param {object} args - The query arguments.
     * @returns {Promise<Game>}
     */
    game: async (_, { id }) => {
      return gameService.getGameById(id)
    }
  },

  Mutation: {
    /**
     * Creates a new game.
     * Requires authentication.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The mutation arguments.
     * @param {object} context - The GraphQL context containing the user.
     * @returns {Promise<Game>}
     */
    createGame: async (_, args, context) => {
      requireAuth(context)
      const { publisherId, ...gameData } = args
      return gameService.createGame({ ...gameData, publisher: publisherId })
    },

    /**
     * Updates an existing game.
     * Requires authentication.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The mutation arguments.
     * @param {object} context - The GraphQL context containing the user.
     * @returns {Promise<Game>}
     */
    updateGame: async (_, { id, ...data}, context) => {
      requireAuth(context)
      const { publisherId, ...gameData } = data
      const updateData = publisherId
        ? { ...gameData, publisher: publisherId }
        : gameData
      return gameService.updateGame(id, updateData)
    },

    /**
     * Deletes a game by its ID.
     * Requires authentication.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The mutation arguments.
     * @param {object} context - The GraphQL context containing the user.
     * @returns {Promise<boolean>}
     */
    deleteGame: async (_, { id}, context) => {
      requireAuth(context)
      return gameService.deleteGame(id)
    }
  }
}