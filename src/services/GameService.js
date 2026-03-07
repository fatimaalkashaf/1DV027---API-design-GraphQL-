/**
 * The service for handling Game business logic.
 * Delegates all of the databse operations to the GameRepository.
 */
export class GameService {
  /**
   * @param {GameRepository} gameRepository - The game repository instance.
   */
  constructor (gameRepository) {
    this.gameRepository = gameRepository
  }

  /**
   * Validates that the provided ID is a valid MongoDB ObjectId.
   *
   * @param {string} id - The ID to validate.
   * @returns {Error} - If the ID format is invalid.
   */
  #validateId (id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid ID format')
    }
  }

  /**
   * Retrieves all games with optional filtering and pagination.
   *
   * @param {object} options - The filter and pagination options.
   * @returns {Promise<{games: Game[], totalCount: number}>}
   */
  async getGames ({ genre, platform, year, limit = 20, offset = 0 } = {}) {
    const filter = {}

    if (genre) filter.genre = genre
    if (platform) filter.platform = platform
    if (year) filter.year = year

    const [game, totalCount] = await Promise.all([
      this.gameRepository.findAll(filter, limit, offset),
      this.gameRepository.count(filter)
    ])

    return { games: game, totalCount }
  }

  /**
   * Retrieves a single game by its ID.
   *
   * @param {string} id - The game's MongoDB ObjectId.
   * @returns {Promise<Game>}
   * @throws {Error} - If the ID format is invalid or game is not found.
   */
  async getGameById (id) {
    this.#validateId(id)
    const game = await this.gameRepository.findById(id)
    if (!game) {
      throw new Error('Game not found')
    }
    return game
  }

  /**
   * Creates a new game.
   *
   * @param {object} data - The game data.
   * @returns {Promise<Game>}
   */
  async createGame (data) {
    return this.gameRepository.create(data)
  }

  /**
   * Updates an already existing game by its ID.
   *
   * @param {string} id - The game's MongoDB ObjectId.
   * @param {object} data - The fields to update.
   * @returns {Promise<Game>}
   * @throws {Error} - If the ID format is invalid or game is not found.
   */
  async updateGame (id, data) {
    this.#validateId(id)
    const game = await this.gameRepository.update(id, data)
    if (!game) {
      throw new Error('Game not found')
    }
    return game
  }

  /**
   * Deletes a game by its ID.
   *
   * @param {string} id - The game's MongoDB ObjectId.
   * @returns {Promise<boolean>}
   * @throws {Error} - If the ID format is invalid or game is not found.
   */
  async deleteGame (id) {
    this.#validateId(id)
    const game = await this.gameRepository.delete(id)
    if (!game) {
      throw new Error('Game not found')
    }
    return true
  }
}