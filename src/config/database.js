import mongoose from "mongoose";

/**
 * Creates a connection to the MongoDB database.
 * Ends the process if the connection fails.
 *
 * @param {string} uri - The MongoDB connection URI.
 * @returns {Promise<void>}
 */
export const connectDatabase = async (uri) => {
  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB successfully!')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
}