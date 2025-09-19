// filepath: d:\Projects\Commit2Team\server\models\User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Portfolio information
  portfolio: {
    year: {
      type: String,
      default: ''
    },
    college: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: '',
      validate: {
        validator: function(v) {
          // Only validate if portfolio is complete
          return !this.portfolio.isPortfolioComplete || (v && v !== '');
        },
        message: 'Gender is required when portfolio is complete'
      }
    },
    skillCategory: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'ai-ml', 'mobile', 'ui-ux'],
      default: '',
      validate: {
        validator: function(v) {
          // Only validate if portfolio is complete
          return !this.portfolio.isPortfolioComplete || (v && v !== '');
        },
        message: 'Skill category is required when portfolio is complete'
      }
    },
    profilePic: {
      type: String, // Store file path or base64
      default: ''
    },
    resumeFile: {
      type: String, // Store file path or base64
      default: ''
    },
    isPortfolioComplete: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('User', userSchema);