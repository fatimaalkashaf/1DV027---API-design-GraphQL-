import { User } from '../models/User.js'

/**
 * The repository for User database operations.
 * Handles all of the direct database interactions for authentication.
 */
export class UserRepository {
  /**
   * Finds a user by their username.
   *
   * @param {string} username - The username to search for.
   * @returns {Promise<User|null>}
   */
  async findByUsername (username) {
    return User.findOne({ username })
  }

  /**
   * Creates a new user in the database.
   *
   * @param {object} data - Tge user data to save.
   * @returns {Promise<User}
   */
  async create (data) {
    const user = new User(data)
    return user.save()
  }
}