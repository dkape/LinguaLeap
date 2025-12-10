const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  optionA: {
    type: String,
    required: true
  },
  optionB: {
    type: String,
    required: true
  },
  optionC: {
    type: String,
    required: true
  },
  optionD: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    enum: ['a', 'b', 'c', 'd'],
    required: true
  },
  pointsValue: {
    type: Number,
    default: 5
  },
  orderIndex: {
    type: Number,
    required: true
  }
});

const challengeItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'quiz'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sourceReference: {
    type: String
  },
  wordCount: {
    type: Number
  },
  estimatedReadingTime: {
    type: Number
  },
  pointsValue: {
    type: Number,
    default: 10
  },
  orderIndex: {
    type: Number,
    required: true
  },
  questions: [quizQuestionSchema]
});

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  topic: {
    type: String
  },
  language: {
    type: String,
    enum: ['de', 'en'],
    default: 'de'
  },
  ageRange: {
    type: String
  },
  readingLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentClass'
  },
  sourceType: {
    type: String,
    enum: ['ai_generated', 'gutenberg', 'custom'],
    default: 'ai_generated'
  },
  sourceReferences: [String],
  totalPoints: {
    type: Number,
    default: 100
  },
  timeLimitMinutes: {
    type: Number,
    default: 30
  },
  estimatedTimeMinutes: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  items: [challengeItemSchema],
  classDescription: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);