import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Optional reference to a project or match
  context: {
    type: {
      type: String,
      enum: ['project', 'match', 'direct'],
      default: 'direct',
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'context.type',
    },
  },
  content: {
    type: String,
    required: true,
  },
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  // Optional attachments
  attachments: [{
    type: String, // URL to the attachment
    name: String,
    size: Number,
    mimeType: String,
  }],
  // Message metadata
  metadata: {
    isSystem: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      enum: ['match', 'project', 'team', 'system'],
    },
  },
}, {
  timestamps: true,
});

// Create indexes for faster lookups
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ 'context.reference': 1 });
MessageSchema.index({ createdAt: -1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema); 