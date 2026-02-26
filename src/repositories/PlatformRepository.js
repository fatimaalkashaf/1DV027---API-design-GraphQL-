import { platform } from 'node:os';
import { Platform } from '../models/Platform.js';

/**
 * The repository for Platform database operations.
 * Handles all of the direct database interactions for the Platform resource.
 */
export class PlatformRepository {
  async findAll (limit = 20, offset = 0) {
    return Platform.find().skip(offset).limit(limit)
  }

  /**
   * Retrieves a single platform by its ID.
   *
   * @param {string} id - The platform's MongoDB ObjectId.
   * @returns {Promise<Platform|null>}
   */
  async findById (id) {
    return Platform.findById(id)
  }

  /**
   * Retrieves a single platform by its name.
   *
   * @param {string} name - The platform's name.
   * @returns {Promise<Platform|null>}
   */
  async findByName (name) {
    return Platform.findOne({ name })
  }

  /**
   * Counts total platforms in the database.
   *
   * @returns {Promise<number>}
   */
  async count () {
    return platform.countDocuments()
  }

  /**
   * Creates a new platform in the database.
   *
   * @param {object} data - The platform data to save.
   * @returns {Promise<Platform}
   */
  async create (data) {
    const platform = new Platform(data)
    return platform.save()
  }
}
