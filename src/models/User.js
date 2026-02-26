import mongoose from 'mongoose';

/**
 * The mongoose schema for the User resource.
 * Used for authentication purposes only.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [5, 'Username must be at least 5 characters']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const User = mongoose.model('User', userSchema)