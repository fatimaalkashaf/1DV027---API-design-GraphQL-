/**
 * The service for handling Platform business logic.
 * Delegates all of the database operations to the PlatformRepository.
 */
export class PlatformService {
  /**
   * @param {PlatformRepository} platformRepository - The platform repository instance.
   */
  constructor (platformRepository) {
    this.platformRepository = platformRepository
  }

  /**
   * Retrieves all platforms with optional pagination.
   *
   * @param {number} limit - The maximum number of results to return.
   * @param {number} offset - The number of results to skip.
   * @returns {Promise<{platforms: Platform[], totalCount: number}>}
   */
  async getPlatforms (limit = 20, offset = 0) {
    const [platforms, totalCount] = await Promise.all([
      this.platformRepository.findAll(limit, offset),
      this.platformRepository.count()
    ])

    return { platforms, totalCount }
  }

  /**
   * Retrieves a single platform by its ID.
   *
   * @param {string} id - The platform's MongoDB ObjectId.
   * @returns {Promise<Platform>}
   * @throws {Error} - If the platform is not found.
   */
  async getPlatformById (id) {
    const platform = await this.platformRepository.findById(id)
    if (!platform) {
      throw new Error('Platform not found')
    }
    return platform
  }
}