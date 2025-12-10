const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedAnswer: {
    type: String,
    enum: ['a', 'b', 'c', 'd']
  },
  isCorrect: {
    type: Boolean
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
});

const itemProgressSchema = new mongoose.Schema({
  challengeItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'reading', 'completed'],
    default: 'not_started'
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  readingSpeedWpm: {
    type: Number
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  quizAnswers: [quizAnswerSchema]
});

const challengeAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'abandoned'],
    default: 'not_started'
  },
  currentItemId: {
    type: mongoose.Schema.Types.ObjectId
  },
  totalPointsEarned: {
    type: Number,
    default: 0
  },
  totalTimeSpentSeconds: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  itemProgress: [itemProgressSchema]
}, {
  timestamps: true
});

// Ensure one attempt per student per challenge
challengeAttemptSchema.index({ studentId: 1, challengeId: 1 }, { unique: true });

module.exports = mongoose.model('ChallengeAttempt', challengeAttemptSchema);