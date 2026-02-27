/**
 * The service for handling Publisher business logic.
 * Delegates all of the database operations to the PublisherRepository.
 */
export class PublisherService {
  /**
   * @param {PublisherRepository} publisherRepository - The publisher repository instance.
   */
  constructor (publisherRepository) {
    this.publisherRepository = publisherRepository
  }

  /**
   * Retrieves all publishers with optional pagination.
   *
   * @param {number} limit - The maximum number of results to return.
   * @param {number} offset - The number of results to skip.
   * @returns {Promise<{publishers: Publisher[], totalCount: number}>}
   */
  async getPublisher (limit = 20, offset = 0) {
    const [publisher, totalCount] = await Promise.all([
      this.publisherRepository.findAll(limit, offset),
      this.publisherRepository.count()
    ])

    return { publishers, totalCount }
  }

  /**
   * Retrieves a single publisher by its ID.
   *
   * @param {string} id - The publisher's MongoDB ObjectId.
   * @returns {Promise<Publisher>}
   * @throws {Error} - If the publisher is not found.
   */
  async getPublisherById (id) {
    const publisher = await this.publisherRepository.findById(id)
    if (!publisher) {
      throw new Error('Publisher not found')
    }
    return publisher
  }
}