const pool = require('../config/db');

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
    time_limit_minutes
  } = req.body;
  const teacher_id = req.user.userId;

  try {
    if (!title || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Title and items are required' });
    }

    // Verify class belongs to teacher if class_id is provided
    if (class_id) {
      const [classCheck] = await pool.query(
        'SELECT id FROM student_classes WHERE id = ? AND teacher_id = ?',
        [class_id, teacher_id]
      );

      if (classCheck.length === 0) {
        return res.status(404).json({ message: 'Class not found' });
      }
    }

    // Create challenge
    const [challengeResult] = await pool.query(`
      INSERT INTO challenges 
      (title, description, topic, language, age_range, reading_level, teacher_id, class_id, total_points, time_limit_minutes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, topic, language, age_range, reading_level, teacher_id, class_id, total_points, time_limit_minutes]);

    const challengeId = challengeResult.insertId;

    // Create challenge items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const [itemResult] = await pool.query(`
        INSERT INTO challenge_items 
        (challenge_id, type, title, content, order_index, points_value, time_estimate_seconds) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [challengeId, item.type, item.title, item.content, i + 1, item.points_value || 10, item.time_estimate_seconds || 60]);

      // If it's a quiz, create quiz questions
      if (item.type === 'quiz' && item.questions) {
        for (let j = 0; j < item.questions.length; j++) {
          const question = item.questions[j];
          await pool.query(`
            INSERT INTO quiz_questions 
            (challenge_item_id, question, option_a, option_b, option_c, option_d, correct_answer, points_value, order_index) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            itemResult.insertId, 
            question.question, 
            question.option_a, 
            question.option_b, 
            question.option_c, 
            question.option_d, 
            question.correct_answer, 
            question.points_value || 5, 
            j + 1
          ]);
        }
      }
    }

    res.status(201).json({ 
      message: 'Challenge created successfully',
      challengeId 
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
    const [challenges] = await pool.query(`
      SELECT 
        c.*,
        sc.name as class_name,
        COUNT(DISTINCT ci.id) as item_count,
        COUNT(DISTINCT sca.student_id) as attempt_count,
        AVG(sca.total_points_earned) as avg_score
      FROM challenges c
      LEFT JOIN student_classes sc ON c.class_id = sc.id
      LEFT JOIN challenge_items ci ON c.id = ci.challenge_id
      LEFT JOIN student_challenge_attempts sca ON c.id = sca.challenge_id AND sca.status = 'completed'
      WHERE c.teacher_id = ?
      GROUP BY c.id
      ORDER BY c.createdAt DESC
    `, [teacher_id]);

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
    // Get challenge info
    const [challenge] = await pool.query(`
      SELECT c.*, sc.name as class_name
      FROM challenges c
      LEFT JOIN student_classes sc ON c.class_id = sc.id
      WHERE c.id = ? AND c.teacher_id = ?
    `, [challengeId, teacher_id]);

    if (challenge.length === 0) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Get challenge items
    const [items] = await pool.query(`
      SELECT * FROM challenge_items 
      WHERE challenge_id = ? 
      ORDER BY order_index
    `, [challengeId]);

    // Get quiz questions for quiz items
    for (let item of items) {
      if (item.type === 'quiz') {
        const [questions] = await pool.query(`
          SELECT * FROM quiz_questions 
          WHERE challenge_item_id = ? 
          ORDER BY order_index
        `, [item.id]);
        item.questions = questions;
      }
    }

    res.status(200).json({ 
      challenge: challenge[0],
      items 
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
    const [challenges] = await pool.query(`
      SELECT 
        c.*,
        sc.name as class_name,
        u.name as teacher_name,
        sca.status as attempt_status,
        sca.total_points_earned,
        sca.total_time_spent_seconds,
        sca.started_at,
        sca.completed_at,
        COUNT(DISTINCT ci.id) as total_items,
        COUNT(DISTINCT sip.id) as completed_items
      FROM challenges c
      JOIN student_classes sc ON c.class_id = sc.id
      JOIN class_memberships cm ON sc.id = cm.class_id
      JOIN users u ON c.teacher_id = u.id
      LEFT JOIN student_challenge_attempts sca ON c.id = sca.challenge_id AND sca.student_id = ?
      LEFT JOIN challenge_items ci ON c.id = ci.challenge_id
      LEFT JOIN student_item_progress sip ON sca.id = sip.attempt_id AND sip.status = 'completed'
      WHERE cm.student_id = ? AND c.isActive = TRUE
      GROUP BY c.id
      ORDER BY c.createdAt DESC
    `, [student_id, student_id]);

    res.status(200).json({ challenges });
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
    // Check if student has access to this challenge
    const [accessCheck] = await pool.query(`
      SELECT c.id
      FROM challenges c
      JOIN student_classes sc ON c.class_id = sc.id
      JOIN class_memberships cm ON sc.id = cm.class_id
      WHERE c.id = ? AND cm.student_id = ? AND c.isActive = TRUE
    `, [challengeId, student_id]);

    if (accessCheck.length === 0) {
      return res.status(403).json({ message: 'Access denied to this challenge' });
    }

    // Check if attempt already exists
    const [existingAttempt] = await pool.query(
      'SELECT id, status FROM student_challenge_attempts WHERE student_id = ? AND challenge_id = ?',
      [student_id, challengeId]
    );

    let attemptId;
    if (existingAttempt.length > 0) {
      if (existingAttempt[0].status === 'completed') {
        return res.status(400).json({ message: 'Challenge already completed' });
      }
      attemptId = existingAttempt[0].id;
      
      // Update to in_progress if not started
      if (existingAttempt[0].status === 'not_started') {
        await pool.query(
          'UPDATE student_challenge_attempts SET status = "in_progress", started_at = NOW() WHERE id = ?',
          [attemptId]
        );
      }
    } else {
      // Create new attempt
      const [result] = await pool.query(`
        INSERT INTO student_challenge_attempts 
        (student_id, challenge_id, status, started_at) 
        VALUES (?, ?, 'in_progress', NOW())
      `, [student_id, challengeId]);
      attemptId = result.insertId;
    }

    res.status(200).json({ 
      message: 'Challenge attempt started',
      attemptId 
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
    // Verify class belongs to teacher
    const [classCheck] = await pool.query(
      'SELECT id FROM student_classes WHERE id = ? AND teacher_id = ?',
      [classId, teacher_id]
    );

    if (classCheck.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const [leaderboard] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.avatarUrl,
        COALESCE(SUM(sca.total_points_earned), 0) as total_points,
        COUNT(CASE WHEN sca.status = 'completed' THEN 1 END) as completed_challenges,
        AVG(CASE WHEN sca.status = 'completed' THEN sca.total_time_spent_seconds END) as avg_completion_time,
        ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(sca.total_points_earned), 0) DESC) as rank_position
      FROM class_memberships cm
      JOIN users u ON cm.student_id = u.id
      LEFT JOIN student_challenge_attempts sca ON u.id = sca.student_id
      LEFT JOIN challenges c ON sca.challenge_id = c.id AND c.class_id = ?
      WHERE cm.class_id = ?
      GROUP BY u.id
      ORDER BY total_points DESC, completed_challenges DESC
    `, [classId, classId]);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Get class leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createChallenge,
  getTeacherChallenges,
  getChallengeDetails,
  getStudentChallenges,
  startChallengeAttempt,
  getClassLeaderboard
};