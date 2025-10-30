const ChallengeAttempt = require('../models/ChallengeAttempt');

const getTeacherPerformance = async (req, res) => {
  try {
    // This is a simplified example. A real implementation would involve more complex aggregation.
    const attempts = await ChallengeAttempt.find({ teacherId: req.user.userId });

    if (attempts.length === 0) {
      return res.json({ averageCompletionRate: 0, averageScore: 0 });
    }

    let totalCompletionRate = 0;
    let totalScore = 0;
    let completedCount = 0;

    for (const attempt of attempts) {
      if (attempt.status === 'completed') {
        totalCompletionRate += 1;
        totalScore += attempt.score;
        completedCount++;
      }
    }

    const averageCompletionRate = totalCompletionRate / attempts.length;
    const averageScore = completedCount > 0 ? totalScore / completedCount : 0;

    res.json({ averageCompletionRate, averageScore });
  } catch (error) {
    console.error('Error fetching teacher performance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getTeacherPerformance };
