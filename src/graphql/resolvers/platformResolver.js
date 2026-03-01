import { PlatformService} from '../../services/PlatformService.js'
import { PlatformRepository } from '../../repositories/PlatformRepository.js'

const platformRepository = new PlatformRepository()
const platformService = new PlatformService(platformRepository)

/**
 * The GraphQL resolvers for Platform operations.
 * Handles all platform queries (read-only)
 */
export const platformResolver = {
  Query: {
    /**
     * Retrieves all platforms with optional pagination.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The query arguments.
     * @returns {Promise<PlatformList>}
     */
    platforms: async (_, { limit, offset }) => {
      return platformService.getPlatforms(limit, offset)
    },

    /**
     * Retrieves a single platform by its ID.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The query arguments.
     * @returns {Promise<Platform>}
     */
    platform: async (_, { id }) => {
      return platformService.getPlatformById(id)
    }
  }
}