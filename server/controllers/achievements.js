const ChallengeAttempt = require('../models/ChallengeAttempt');

const ACHIEVEMENTS_DEFINITIONS = [
    {
        id: 'first_login',
        titleKey: 'student.achievements.items.firstLogin.title',
        descriptionKey: 'student.achievements.items.firstLogin.description',
        check: () => true // Always true if they can access this
    },
    {
        id: 'completed_5',
        titleKey: 'student.achievements.items.completed5.title',
        descriptionKey: 'student.achievements.items.completed5.description',
        check: (stats) => stats.completedCount >= 5
    },
    {
        id: 'completed_10',
        title: '10 Challenges',
        description: 'Complete 10 challenges.',
        check: (stats) => stats.completedCount >= 10
    },
    {
        id: 'high_scorer',
        title: 'High Scorer',
        description: 'Get a score of 90% or higher.',
        check: (stats) => stats.hasHighScore
    },
    {
        id: 'speed_reader',
        title: 'Speed Reader',
        description: 'Complete a challenge in under 2 minutes.',
        check: (stats) => stats.hasSpeedRun
    },
    {
        id: 'perfect_score',
        titleKey: 'student.achievements.items.perfectScore.title',
        descriptionKey: 'student.achievements.items.perfectScore.description',
        check: (stats) => stats.hasPerfectScore
    }
];

const getStudentAchievements = async (req, res) => {
    try {
        const studentId = req.user.userId;

        // Fetch all completed attempts
        const attempts = await ChallengeAttempt.find({
            studentId,
            status: 'completed'
        }).populate('challengeId');

        // Calculate stats
        const stats = {
            completedCount: attempts.length,
            hasHighScore: false,
            hasSpeedRun: false,
            hasPerfectScore: false
        };

        for (const attempt of attempts) {
            const challenge = attempt.challengeId;
            if (!challenge) continue;

            const maxPoints = challenge.totalPoints || 100; // Default if missing
            const accuracy = (attempt.totalPointsEarned / maxPoints) * 100;

            if (accuracy >= 90) stats.hasHighScore = true;
            if (accuracy === 100) stats.hasPerfectScore = true;

            // Speed run: < 2 minutes (120 seconds)
            // We need to ensure totalTimeSpentSeconds is populated correctly in attempts
            if (attempt.totalTimeSpentSeconds && attempt.totalTimeSpentSeconds < 120) {
                stats.hasSpeedRun = true;
            }
        }

        // Check achievements
        const achievements = ACHIEVEMENTS_DEFINITIONS.map(def => ({
            id: def.id,
            title: def.title, // Fallback if no key
            description: def.description, // Fallback if no key
            titleKey: def.titleKey,
            descriptionKey: def.descriptionKey,
            unlocked: def.check(stats)
        }));

        res.json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getStudentAchievements };
