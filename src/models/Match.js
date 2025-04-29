import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  // The project this match is for
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  // The user being matched
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The user who created the project
  projectOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Match status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending',
  },
  // Match score (0-100)
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  // Matching details
  matchDetails: {
    // Skills that matched
    matchedSkills: [{
      skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
      requiredLevel: String,
      userLevel: String,
      matchScore: Number,
    }],
    // Skills that are missing
    missingSkills: [{
      skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
      requiredLevel: String,
    }],
    // Additional matching factors
    factors: {
      availabilityMatch: Number,
      timezoneMatch: Number,
      projectTypeMatch: Number,
    },
  },
  // Communication history
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  // Timeline
  timeline: {
    matchedAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: Date,
    expiresAt: Date,
  },
}, {
  timestamps: true,
});

// Create indexes for faster lookups
MatchSchema.index({ project: 1, user: 1 }, { unique: true });
MatchSchema.index({ user: 1, status: 1 });
MatchSchema.index({ projectOwner: 1, status: 1 });
MatchSchema.index({ score: -1 });

export default mongoose.models.Match || mongoose.model('Match', MatchSchema); 