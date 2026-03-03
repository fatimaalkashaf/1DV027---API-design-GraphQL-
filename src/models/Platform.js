import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Platform name is required'],
      unique: true,
      trim: true
    },
    totalGames: {
      type: Number,
      default: 0,
      min: 0
    },
    genres: {
      type: [String],
      default: []
    },
    releaseYears: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Platform = mongoose.model('Platform', platformSchema)