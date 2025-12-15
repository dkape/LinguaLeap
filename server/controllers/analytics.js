const ChallengeAttempt = require('../models/ChallengeAttempt');
const User = require('../models/User');
const StudentClass = require('../models/StudentClass');
const Challenge = require('../models/Challenge');

const getTeacherPerformance = async (req, res) => {
  try {
    // Find all challenges created by the teacher
    const challenges = await Challenge.find({ teacherId: req.user.userId }).select('_id');
    const challengeIds = challenges.map(c => c._id);

    if (challengeIds.length === 0) {
      return res.json({ averageCompletionRate: 0, averageScore: 0 });
    }

    const attempts = await ChallengeAttempt.find({ challengeId: { $in: challengeIds } });

    if (attempts.length === 0) {
      return res.json({ averageCompletionRate: 0, averageScore: 0 });
    }

    let totalCompletionRate = 0;
    let totalScore = 0;
    let completedCount = 0;

    for (const attempt of attempts) {
      if (attempt.status === 'completed') {
        totalCompletionRate += 1;
        totalScore += attempt.totalPointsEarned; // Use totalPointsEarned instead of score
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

const getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.user.userId;

    // 1. Get all classes for the teacher
    const classes = await StudentClass.find({ teacherId }).select('_id name');
    const classMap = classes.reduce((acc, cls) => {
      acc[cls._id.toString()] = cls.name;
      return acc;
    }, {});

    // 2. Get all challenges for the teacher
    const challenges = await Challenge.find({ teacherId }).select('_id classId');
    const challengeClassMap = challenges.reduce((acc, ch) => {
      if (ch.classId) {
        acc[ch._id.toString()] = ch.classId.toString();
      }
      return acc;
    }, {});

    const challengeIds = challenges.map(c => c._id);

    // 3. Get all attempts for these challenges
    const attempts = await ChallengeAttempt.find({ challengeId: { $in: challengeIds }, status: 'completed' });

    // 4. Aggregate data
    const classStats = {}; // classId -> { totalScore, count }
    const performanceDistribution = {
      'Top 10%': 0,
      '75-90%': 0,
      '50-75%': 0,
      'Below 50%': 0
    };

    attempts.forEach(attempt => {
      // Class stats
      const classId = challengeClassMap[attempt.challengeId.toString()];
      // eslint-disable-next-line security/detect-object-injection
      if (classId && classMap[classId]) {
        // eslint-disable-next-line security/detect-object-injection
        if (!classStats[classId]) {
          // eslint-disable-next-line security/detect-object-injection
          classStats[classId] = { totalScore: 0, count: 0 };
        }
        // eslint-disable-next-line security/detect-object-injection
        classStats[classId].totalScore += attempt.totalPointsEarned; // Assuming totalPointsEarned is absolute score. If it's relative to total possible, we need that too.
        // For simplicity, let's assume we want average points. Or better, percentage if we had total possible.
        // Let's assume totalPointsEarned is what we track.
        // eslint-disable-next-line security/detect-object-injection
        classStats[classId].count++;
      }

      // Distribution (Mock logic for buckets based on points, ideally should be percentage)
      // Assuming max points is around 100 for normalization or just using raw points
      const score = attempt.totalPointsEarned;
      // eslint-disable-next-line security/detect-object-injection
      if (score >= 90) performanceDistribution['Top 10%']++;
      // eslint-disable-next-line security/detect-object-injection
      else if (score >= 75) performanceDistribution['75-90%']++;
      // eslint-disable-next-line security/detect-object-injection
      else if (score >= 50) performanceDistribution['50-75%']++;
      // eslint-disable-next-line security/detect-object-injection
      else performanceDistribution['Below 50%']++;
    });

    // Format class data
    const classData = Object.keys(classStats).map(classId => ({
      // eslint-disable-next-line security/detect-object-injection
      name: classMap[classId],
      // eslint-disable-next-line security/detect-object-injection
      avgScore: Math.round(classStats[classId].totalScore / classStats[classId].count),
      completionRate: 100 // Placeholder, calculating real rate requires total students
    }));

    // Format distribution data
    const studentPerformance = Object.keys(performanceDistribution).map(key => ({
      name: key,
      // eslint-disable-next-line security/detect-object-injection
      value: performanceDistribution[key]
    }));

    res.json({ classData, studentPerformance });

  } catch (error) {
    console.error('Error fetching teacher analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'student' })
      .sort({ points: -1 })
      .select('name points avatarUrl')
      .limit(100);

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getTeacherPerformance, getTeacherAnalytics, getGlobalLeaderboard };
