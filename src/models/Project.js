import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft',
  },
  type: {
    type: String,
    enum: ['freelance', 'collaboration', 'hiring'],
    default: 'collaboration',
  },
  // Required skills for the project
  requiredSkills: [{
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    },
    priority: {
      type: String,
      enum: ['required', 'preferred', 'nice-to-have'],
      default: 'required',
    },
  }],
  // Team members
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: String,
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    }],
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Project timeline
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
    }],
  },
  // Project settings
  settings: {
    visibility: {
      type: String,
      enum: ['public', 'private', 'team-only'],
      default: 'public',
    },
    collaboration: {
      allowNewMembers: Boolean,
      approvalRequired: Boolean,
    },
  },
  // Project metrics
  metrics: {
    views: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },
    matches: {
      type: Number,
      default: 0,
    },
  },
  budget: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

// Create indexes for faster lookups
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ 'requiredSkills.skill': 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema); 