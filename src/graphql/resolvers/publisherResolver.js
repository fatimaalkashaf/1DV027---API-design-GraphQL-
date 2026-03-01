import { PublisherService } from '../../services/PublisherService.js'
import { PublisherRepository } from '../../repositories/PublisherRepository.js'

const publisherRepository = new PublisherRepository()
const publisherService = new PublisherService(publisherRepository)

/**
 * The GraphQL resolvers for Publisher operations.
 * Handles all publisher queries (read-only).
 */
export const publisherResolver = {
  Query: {
    /**
     * Retrieves all publishers with optional pagination.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The query arguments.
     * @returns {Promise<PublisherList>}
     */
    publishers: async (_, { limit, offset }) => {
      return publisherService.getPublishers(limit, offset)
    },

    /**
     * Retrieves a single publisher by its ID.
     *
     * @param {object} _ - The unused parent resolver.
     * @param {object} args - The query arguments.
     * @returns {Promise<Publisher>}
     */
    publisher: async (_, { id }) => {
      return publisherService.getPublisherById(id)
    }
  }
}