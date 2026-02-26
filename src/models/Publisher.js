import mongoose from "mongoose";

/**
 * The Mongoose schema for the Publisher resource.
 * Collected from the video gam sales dataset.
 */
const publisherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Publisher name is required'],
      unique: true,
      trim: true
    },
    totalGames: {
      type: Number,
      default: 0,
      min: 0
    },
    totalGlobalSales: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Publisher = mongoose.model('Publisher', publisherSchema)