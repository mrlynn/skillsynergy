import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
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
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  }],
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  }],
  // Profile Information
  bio: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
  },
  location: {
    type: String,
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  // Portfolio
  portfolio: [{
    title: String,
    description: String,
    url: String,
    image: String,
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    }],
  }],
  // Availability
  availability: {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    hoursPerWeek: {
      type: Number,
      default: 0,
    },
  },
  // Collaboration Preferences
  preferences: {
    projectTypes: [{ type: String }],
    minBudget: { type: Number, default: 0 },
    maxBudget: { type: Number, default: 100000 },
    timezone: { type: String, default: 'UTC' }
  },
  embedding: { 
    type: [Number],
    default: [],
    index: {
      type: 'vector',
      dimensions: 1536,
      similarity: 'cosine'
    }
  },
  // Active Projects
  activeProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  // Matches
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  }],
  // Settings
  settings: {
    notifications: {
      email: Boolean,
      push: Boolean,
      matches: Boolean,
      messages: Boolean,
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'connections-only'],
      default: 'public',
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = new Date();
  next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user is admin
UserSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

export default mongoose.models.User || mongoose.model('User', UserSchema); 