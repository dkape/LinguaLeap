const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const ChallengeAttempt = require('../models/ChallengeAttempt');
const StudentClass = require('../models/StudentClass');

// Create a new challenge
const createChallenge = async (req, res) => {
  const { 
    title, 
    description, 
    topic, 
    language, 
    age_range, 
    reading_level, 
    class_id,
    items,
    total_points,
    time_limit_minutes,
    class_description
  } = req.body;
  const teacher_id = req.user.userId;

  try {
    if (!title || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Title and items are required' });
    }

    // Verify class belongs to teacher if class_id is provided
    if (class_id) {
      if (typeof class_id !== 'string' || !mongoose.Types.ObjectId.isValid(class_id)) {
        return res.status(400).json({ message: 'Invalid class ID format' });
      }
      const studentClass = await StudentClass.findOne({ _id: class_id, teacherId: teacher_id });
      if (!studentClass) {
        return res.status(404).json({ message: 'Class not found or you do not have permission' });
      }
    }

    const newChallenge = new Challenge({
      title,
      description,
      topic,
      language,
      ageRange: age_range,
      readingLevel: reading_level,
      teacherId: teacher_id,
      classId: class_id || null,
      totalPoints: total_points,
      timeLimitMinutes: time_limit_minutes,
      items,
      classDescription: class_description
    });

    const savedChallenge = await newChallenge.save();

    res.status(201).json({ 
      message: 'Challenge created successfully',
      challengeId: savedChallenge._id
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get challenges for a teacher
const getTeacherChallenges = async (req, res) => {
  const teacher_id = req.user.userId;

  try {
    const challenges = await Challenge.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacher_id) } },
      {
        $lookup: {
          from: 'studentclasses',
          localField: 'classId',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      {
        $lookup: {
          from: 'challengeattempts',
          localField: '_id',
          foreignField: 'challengeId',
          as: 'attempts'
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          topic: 1,
          language: 1,
          ageRange: 1,
          readingLevel: 1,
          isActive: 1,
          createdAt: 1,
          class_name: { $arrayElemAt: ['$classInfo.name', 0] },
          item_count: { $size: '$items' },
          attempt_count: { $size: '$attempts' },
          avg_score: { $avg: '$attempts.totalPointsEarned' },
          classDescription: 1,
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ challenges });
  } catch (error) {
    console.error('Get teacher challenges error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get challenge details
const getChallengeDetails = async (req, res) => {
  const { challengeId } = req.params;
  const teacher_id = req.user.userId;

  try {
    const challenge = await Challenge.findOne({ _id: challengeId, teacherId: teacher_id })
      .populate('classId', 'name')
      .lean();

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Attach class_name for consistency with getTeacherChallenges
    if (challenge.classId) {
      challenge.class_name = challenge.classId.name;
    }

    res.status(200).json({ 
      challenge,
      items: challenge.items
    });
  } catch (error) {
    console.error('Get challenge details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get challenges for a student
const getStudentChallenges = async (req, res) => {
  const student_id = req.user.userId;

  try {
    const studentClasses = await StudentClass.find({ students: student_id }).select('_id');
    const classIds = studentClasses.map(c => c._id);

    const challenges = await Challenge.find({
      classId: { $in: classIds },
      isActive: true
    })
    .populate('teacherId', 'name')
    .populate('classId', 'name')
    .lean();

    const attempts = await ChallengeAttempt.find({ studentId: student_id }).lean();
    const attemptsMap = new Map(attempts.map(a => [a.challengeId.toString(), a]));

    const result = challenges.map(challenge => {
      const attempt = attemptsMap.get(challenge._id.toString());
      return {
        ...challenge,
        teacher_name: challenge.teacherId.name,
        class_name: challenge.classId.name,
        attempt_status: attempt ? attempt.status : 'not_started',
        total_points_earned: attempt ? attempt.totalPointsEarned : null,
        total_time_spent_seconds: attempt ? attempt.totalTimeSpentSeconds : null,
        started_at: attempt ? attempt.startedAt : null,
        completed_at: attempt ? attempt.completedAt : null,
        total_items: challenge.items.length,
        completed_items: attempt ? attempt.itemProgress.filter(p => p.status === 'completed').length : 0
      };
    });

    res.status(200).json({ challenges: result });
  } catch (error) {
    console.error('Get student challenges error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Start a challenge attempt
const startChallengeAttempt = async (req, res) => {
  const { challengeId } = req.params;
  const student_id = req.user.userId;

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: 'Challenge not found or is not active' });
    }

    const isStudentInClass = await StudentClass.exists({ _id: challenge.classId, students: student_id });
    if (!isStudentInClass) {
      return res.status(403).json({ message: 'Access denied to this challenge' });
    }

    let attempt = await ChallengeAttempt.findOne({ studentId: student_id, challengeId: challengeId });

    if (attempt) {
      if (attempt.status === 'completed') {
        return res.status(400).json({ message: 'Challenge already completed' });
      }
      if (attempt.status === 'not_started') {
        attempt.status = 'in_progress';
        attempt.startedAt = new Date();
        await attempt.save();
      }
    } else {
      attempt = new ChallengeAttempt({
        studentId: student_id,
        challengeId: challengeId,
        status: 'in_progress',
        startedAt: new Date()
      });
      await attempt.save();
    }

    res.status(200).json({ 
      message: 'Challenge attempt started',
      attemptId: attempt._id
    });
  } catch (error) {
    console.error('Start challenge attempt error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get leaderboard for a class
const getClassLeaderboard = async (req, res) => {
  const { classId } = req.params;
  const teacher_id = req.user.userId;

  try {
    const studentClass = await StudentClass.findOne({ _id: classId, teacherId: teacher_id });
    if (!studentClass) {
      return res.status(404).json({ message: 'Class not found or you do not have permission' });
    }

    const leaderboard = await ChallengeAttempt.aggregate([
      { $match: { challengeId: { $in: await Challenge.find({ classId: classId }).distinct('_id') } } },
      {
        $group: {
          _id: '$studentId',
          total_points: { $sum: '$totalPointsEarned' },
          completed_challenges: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          avg_completion_time: { $avg: '$totalTimeSpentSeconds' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      {
        $unwind: '$studentInfo'
      },
      {
        $project: {
          id: '$_id',
          name: '$studentInfo.name',
          avatarUrl: '$studentInfo.avatarUrl',
          total_points: 1,
          completed_challenges: 1,
          avg_completion_time: 1,
          _id: 0
        }
      },
      { $sort: { total_points: -1, completed_challenges: -1 } },
      { 
        $group: { 
          _id: null, 
          leaderboard: { $push: '$$ROOT' } 
        } 
      },
      {
        $unwind: { 
          path: '$leaderboard', 
          includeArrayIndex: 'rank_position' 
        }
      },
      {
        $replaceRoot: { 
          newRoot: { $mergeObjects: [ '$leaderboard', { rank_position: { $add: ['$rank_position', 1] } } ] } 
        }
      }
    ]);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Get class leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Toggle challenge status (active/inactive)
const toggleChallengeStatus = async (req, res) => {
  const { challengeId } = req.params;
  const teacher_id = req.user.userId;

  try {
    const challenge = await Challenge.findOne({ _id: challengeId, teacherId: teacher_id });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found or you do not have permission' });
    }

    challenge.isActive = !challenge.isActive;
    await challenge.save();

    res.status(200).json({ 
      message: `Challenge status updated to ${challenge.isActive ? 'active' : 'inactive'}`,
      isActive: challenge.isActive
    });
  } catch (error) {
    console.error('Toggle challenge status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an existing challenge
const updateChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const teacher_id = req.user.userId;
  const { title, description, topic, language, age_range, reading_level, class_id, items, total_points, time_limit_minutes } = req.body;

  try {
    const challenge = await Challenge.findOne({ _id: challengeId, teacherId: teacher_id });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found or you do not have permission' });
    }

    // Update fields
    challenge.title = title || challenge.title;
    challenge.description = description || challenge.description;
    challenge.topic = topic || challenge.topic;
    challenge.language = language || challenge.language;
    challenge.ageRange = age_range !== undefined ? age_range : challenge.ageRange;
    challenge.readingLevel = reading_level !== undefined ? reading_level : challenge.readingLevel;
    challenge.classId = class_id || challenge.classId;
    challenge.totalPoints = total_points !== undefined ? total_points : challenge.totalPoints;
    challenge.timeLimitMinutes = time_limit_minutes !== undefined ? time_limit_minutes : challenge.timeLimitMinutes;
    challenge.items = items || challenge.items;

    await challenge.save();

    res.status(200).json({ message: 'Challenge updated successfully' });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createChallenge,
  getTeacherChallenges,
  getChallengeDetails,
  getStudentChallenges,
  startChallengeAttempt,
  getClassLeaderboard,
  toggleChallengeStatus,
  updateChallenge
};
