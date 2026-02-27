import jwt from 'jsonwebtoken'

/**
 * Verifies the JWT token from the Authorization header.
 * Attaches the decoded user payload to the request context if it is valid.
 *
 * @param {object} req - The Express request object.
 * @returns {object|null} - The decoded user payload or null if it is invalid.
 */
export const verifyToken = (req) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return null
    }

    // Extracts the token from the Authorization header.
    const token = authHeader.split(' ')[1]
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Throws an authentication error if the user is not authenticated.
 * Used to protect mutations.
 *
 * @param {object} context - The GraphQL context object.
 * @throws {Error} - If the user is not authenticated.
 */
export const requireAuth = (context) => {
  if (!context.user) {
    throw new Error('Authentication required')
  }
}