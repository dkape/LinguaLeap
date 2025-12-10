const mongoose = require('mongoose');

const learningPathItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order_index: {
    type: Number,
    required: true
  }
});

const learningPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  levels: [learningPathItemSchema],
  studentGroupDescription: {
    type: String
  },
  ageRange: {
    type: String
  },
  readingLevel: {
    type: String
  },
  language: {
    type: String,
    enum: ['en', 'de']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningPath', learningPathSchema);