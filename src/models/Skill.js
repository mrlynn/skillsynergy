import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'development',
      'design',
      'marketing',
      'writing',
      'business',
      'data',
      'product',
      'other'
    ],
  },
  description: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    default: null,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  // Complementary skills (skills that work well with this skill)
  complementarySkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  // Popularity metrics
  popularity: {
    type: Number,
    default: 0,
  },
  // Verification requirements
  verification: {
    required: Boolean,
    methods: [String], // e.g., ['portfolio', 'certification', 'test']
  },
}, {
  timestamps: true,
});

// Create indexes for faster lookups
SkillSchema.index({ name: 1 });
SkillSchema.index({ category: 1 });
SkillSchema.index({ parent: 1 });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema); 