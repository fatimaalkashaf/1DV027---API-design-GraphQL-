import mongoose from "mongoose";

/**
 * The Mongoose schema for the Game resource.
 * Represents a video game with sales data.
 */
const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Game name is required'],
      trim: true
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      trim: true
    },
    year: {
      type: Number,
      min: [1970, 'Year must be after 1970'],
      max: [2030, 'Year must be before 2026']
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publisher',
      required: [true, 'Publisher is required']
    },
    naSales: {
      type: Number,
      default: 0,
      min: 0
    },
    euSales: {
      type: Number,
      default: 0,
      min: 0
    },
    jpSales: {
      type: Number,
      default: 0,
      min: 0
    },
    otherSales: {
      type: Number,
      default: 0,
      min: 0
    },
    globalSales: {
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

export const Game = mongoose.model('Game', gameSchema)