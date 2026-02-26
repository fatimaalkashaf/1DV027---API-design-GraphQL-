import { Game } from '../models/Game.js'

/**
 * The repository for Game database operations.
 * Handles all of the direct database interaction for the Game resource.
 */
export class GameRepository {
  async findAll (filter = {}, limit = 20, offset = 0) {
    return Game.find(filter)
    .populate('publisher')
    .skip(offset)
    .limit(limit)
  }

  /**
   * Retrieves a single game by its ID.
   *
   * @param {string} id - The game's MongoDB ObjectId.
   * @returns {Promise<Game|null>}
   */
  async findById (id) {
    return Game.findById(id).populate('publisher')
  }

  /**
   * Counts total games that matches a filter.
   * Used for the pagination metadata.
   *
   * @param {object} filter - The MongoDB filter object.
   * @returns {Promise<number>}
   */
  async count (filter = {}) {
    return Game.countDocuments(filter)
  }

  /**
   * Creates a new game in the database.
   *
   * @param {object} data - The game data to save.
   * @returns {Promise<Game>}
   */
  async create (data) {
    const game = new Game(data)
    return game.save()
  }

  /**
   * Updates an existing game by its ID.
   *
   * @param {string} id - The game's MongoDB ObjectId.
   * @param {object} data - The fields to update.
   * @returns {Promise<Game|null>}
   */
  async update (id, data) {
    return Game.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('publisher')
  }

  /**
   * Deletes a game by its ID.
   *
   * @param {string} id - The game's MongoDB ObjectId.
   * @returns {Promise<Game|null>}
   */
  async delete (id) {
    return Game.findByIdAndDelete(id)
  }
}