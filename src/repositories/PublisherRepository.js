import { Publisher } from '../models/Publisher.js'

/**
 * The repository for Publisher database operations.
 * Handles all of  the direct database interaction for the Publisher resource.
 */
export class PublisherRepository {
  async findAll (limit = 20, offset = 0) {
    return Publisher.find().skip(offset).limit(limit)
  }

  /**
   * Retrieves a single publisher by its ID.
   *
   * @param {string} id - The publisher's MongoDB ObjectId.
   * @returns {Promise<Publisher|null>}
   */
  async findById (id) {
    return Publisher.findById(id)
  }

  /**
   * Retrieves a single publisher by its name.
   *
   * @param {string} name - The publisher's name.
   * @returns {Promise<Publisher|null>}
   */
  async findByName (name) {
    return Publisher.findOne({ name })
  }

  /**
   * Counts total publishers in the database.
   *
   * @returns {Promise<number>}
   */
  async count () {
    return Publisher.countDocuments()
  }

  /**
   * Creates a new publisher in the database.
   *
   * @param {object} data - The publisher data to save.
   * @returns {Promise<Publisher>}
   */
  async create (data) {
    const publisher = new Publisher(data)
    return publisher.save()
  }
}