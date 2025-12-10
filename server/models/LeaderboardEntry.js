const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentClass'
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  points: {
    type: Number,
    default: 0
  },
  completionTimeSeconds: {
    type: Number
  },
  accuracyPercentage: {
    type: Number
  },
  readingSpeedAvgWpm: {
    type: Number
  },
  rankPosition: {
    type: Number
  },
  achievedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);