import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * The service for handling authentication logic.
 * Manages user registration, login and JWT token generation.
 */
export class AuthService {
  /**
   * @param {UserRepository} userRepository - The user repository instance.
   */
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  /**
   * Registers a new user with a hashed password.
   *
   * @param {string} username - The chosen username.
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<User>}
   * @throws {Error} - If the username already exists.
   */
  async register (username, password) {
    const existingUser = await this.userRepository.findByUsername(username)
    if (existingUser) {
      throw new Error('Username already exists')
    }

    // Hashes the password before saving it.
    const hashedPassword = await bcrypt.hash(password, 12)
    return this.userRepository.create({ username, password: hashedPassword })
  }

  /**
   * Authenticates a user and returns a signed JWT token.
   *
   * @param {string} username - The username to authenticate.
   * @param {string} password - The plain text password to verify.
   * @returns {Promise<string>} - A signed JWT token.
   * @throws {Error} - If the credentials are invalid.
   */
  async login (username, password) {
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    return this.#generateToken(user)
  }

  /**
   * Generates a signed JWT token for a user.
   *
   * @param {object} user - The user object.
   * @returns {string} - A signed JWT token.
   */
  #generateToken (user) {
    return jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
  }
}