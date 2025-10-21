const pool = require('../config/db');

// Get challenge attempt details for student
const getChallengeAttempt = async (req, res) => {
  const { attemptId } = req.params;
  const student_id = req.user.userId;

  try {
    // Get attempt details
    const [attempt] = await pool.query(`
      SELECT 
        sca.*,
        c.title as challenge_title,
        c.description as challenge_description,
        c.total_points as max_points,
        c.time_limit_minutes
      FROM student_challenge_attempts sca
      JOIN challenges c ON sca.challenge_id = c.id
      WHERE sca.id = ? AND sca.student_id = ?
    `, [attemptId, student_id]);

    if (attempt.length === 0) {
      return res.status(404).json({ message: 'Challenge attempt not found' });
    }

    // Get challenge items with progress
    const [items] = await pool.query(`
      SELECT 
        ci.*,
        sip.status as progress_status,
        sip.time_spent_seconds,
        sip.points_earned,
        sip.reading_speed_wpm,
        sip.started_at as item_started_at,
        sip.completed_at as item_completed_at
      FROM challenge_items ci
      LEFT JOIN student_item_progress sip ON ci.id = sip.challenge_item_id AND sip.attempt_id = ?
      WHERE ci.challenge_id = ?
      ORDER BY ci.order_index
    `, [attemptId, attempt[0].challenge_id]);

    // Get quiz questions for quiz items
    for (let item of items) {
      if (item.type === 'quiz') {
        const [questions] = await pool.query(`
          SELECT 
            qq.*,
            qa.selected_answer,
            qa.is_correct,
            qa.time_spent_seconds as answer_time
          FROM quiz_questions qq
          LEFT JOIN quiz_answers qa ON qq.id = qa.question_id AND qa.attempt_id = ?
          WHERE qq.challenge_item_id = ?
          ORDER BY qq.order_index
        `, [attemptId, item.id]);
        item.questions = questions;
      }
    }

    res.status(200).json({ 
      attempt: attempt[0],
      items 
    });
  } catch (error) {
    console.error('Get challenge attempt error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Start reading a text item
const startReadingItem = async (req, res) => {
  const { attemptId, itemId } = req.params;
  const student_id = req.user.userId;

  try {
    // Verify attempt belongs to student
    const [attemptCheck] = await pool.query(
      'SELECT id FROM student_challenge_attempts WHERE id = ? AND student_id = ?',
      [attemptId, student_id]
    );

    if (attemptCheck.length === 0) {
      return res.status(404).json({ message: 'Challenge attempt not found' });
    }

    // Check if progress record exists
    const [existingProgress] = await pool.query(
      'SELECT id, status FROM student_item_progress WHERE attempt_id = ? AND challenge_item_id = ?',
      [attemptId, itemId]
    );

    if (existingProgress.length > 0) {
      if (existingProgress[0].status === 'completed') {
        return res.status(400).json({ message: 'Item already completed' });
      }
      
      // Update to reading status
      await pool.query(
        'UPDATE student_item_progress SET status = "reading", started_at = NOW() WHERE id = ?',
        [existingProgress[0].id]
      );
    } else {
      // Create new progress record
      await pool.query(`
        INSERT INTO student_item_progress 
        (attempt_id, challenge_item_id, status, started_at) 
        VALUES (?, ?, 'reading', NOW())
      `, [attemptId, itemId]);
    }

    // Update current item in attempt
    await pool.query(
      'UPDATE student_challenge_attempts SET current_item_id = ? WHERE id = ?',
      [itemId, attemptId]
    );

    res.status(200).json({ message: 'Reading started' });
  } catch (error) {
    console.error('Start reading item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Complete reading a text item
const completeReadingItem = async (req, res) => {
  const { attemptId, itemId } = req.params;
  const { reading_time_seconds, word_count } = req.body;
  const student_id = req.user.userId;

  try {
    // Verify attempt belongs to student
    const [attemptCheck] = await pool.query(
      'SELECT id FROM student_challenge_attempts WHERE id = ? AND student_id = ?',
      [attemptId, student_id]
    );

    if (attemptCheck.length === 0) {
      return res.status(404).json({ message: 'Challenge attempt not found' });
    }

    // Calculate reading speed (words per minute)
    const reading_speed_wpm = word_count && reading_time_seconds > 0 
      ? (word_count / reading_time_seconds) * 60 
      : null;

    // Get item points
    const [item] = await pool.query(
      'SELECT points_value FROM challenge_items WHERE id = ?',
      [itemId]
    );

    const points_earned = item.length > 0 ? item[0].points_value : 0;

    // Update progress
    await pool.query(`
      UPDATE student_item_progress 
      SET 
        status = 'completed',
        time_spent_seconds = ?,
        points_earned = ?,
        reading_speed_wpm = ?,
        completed_at = NOW()
      WHERE attempt_id = ? AND challenge_item_id = ?
    `, [reading_time_seconds, points_earned, reading_speed_wpm, attemptId, itemId]);

    // Update total points in attempt
    await pool.query(`
      UPDATE student_challenge_attempts 
      SET total_points_earned = total_points_earned + ?,
          total_time_spent_seconds = total_time_spent_seconds + ?
      WHERE id = ?
    `, [points_earned, reading_time_seconds, attemptId]);

    res.status(200).json({ 
      message: 'Reading completed',
      points_earned,
      reading_speed_wpm
    });
  } catch (error) {
    console.error('Complete reading item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit quiz answers
const submitQuizAnswers = async (req, res) => {
  const { attemptId, itemId } = req.params;
  const { answers } = req.body; // Array of { questionId, selectedAnswer, timeSpent }
  const student_id = req.user.userId;

  try {
    // Verify attempt belongs to student
    const [attemptCheck] = await pool.query(
      'SELECT id FROM student_challenge_attempts WHERE id = ? AND student_id = ?',
      [attemptId, student_id]
    );

    if (attemptCheck.length === 0) {
      return res.status(404).json({ message: 'Challenge attempt not found' });
    }

    let totalPoints = 0;
    let correctAnswers = 0;
    let totalQuestions = answers.length;

    // Process each answer
    for (const answer of answers) {
      const { questionId, selectedAnswer, timeSpent } = answer;

      // Get correct answer and points
      const [question] = await pool.query(
        'SELECT correct_answer, points_value FROM quiz_questions WHERE id = ?',
        [questionId]
      );

      if (question.length === 0) continue;

      const isCorrect = selectedAnswer === question[0].correct_answer;
      const pointsEarned = isCorrect ? question[0].points_value : 0;

      if (isCorrect) correctAnswers++;
      totalPoints += pointsEarned;

      // Save answer
      await pool.query(`
        INSERT INTO quiz_answers 
        (attempt_id, question_id, selected_answer, is_correct, time_spent_seconds) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        selected_answer = VALUES(selected_answer),
        is_correct = VALUES(is_correct),
        time_spent_seconds = VALUES(time_spent_seconds),
        answered_at = NOW()
      `, [attemptId, questionId, selectedAnswer, isCorrect, timeSpent || 0]);
    }

    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const totalTimeSpent = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);

    // Update item progress
    await pool.query(`
      INSERT INTO student_item_progress 
      (attempt_id, challenge_item_id, status, time_spent_seconds, points_earned, completed_at) 
      VALUES (?, ?, 'completed', ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
      status = 'completed',
      time_spent_seconds = VALUES(time_spent_seconds),
      points_earned = VALUES(points_earned),
      completed_at = NOW()
    `, [attemptId, itemId, totalTimeSpent, totalPoints]);

    // Update total points in attempt
    await pool.query(`
      UPDATE student_challenge_attempts 
      SET total_points_earned = total_points_earned + ?,
          total_time_spent_seconds = total_time_spent_seconds + ?
      WHERE id = ?
    `, [totalPoints, totalTimeSpent, attemptId]);

    res.status(200).json({ 
      message: 'Quiz completed',
      points_earned: totalPoints,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      accuracy_percentage: accuracy
    });
  } catch (error) {
    console.error('Submit quiz answers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Complete entire challenge
const completeChallenge = async (req, res) => {
  const { attemptId } = req.params;
  const student_id = req.user.userId;

  try {
    // Verify attempt belongs to student
    const [attempt] = await pool.query(`
      SELECT sca.*, c.class_id, c.total_points as max_points
      FROM student_challenge_attempts sca
      JOIN challenges c ON sca.challenge_id = c.id
      WHERE sca.id = ? AND sca.student_id = ?
    `, [attemptId, student_id]);

    if (attempt.length === 0) {
      return res.status(404).json({ message: 'Challenge attempt not found' });
    }

    // Check if all items are completed
    const [itemsStatus] = await pool.query(`
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN sip.status = 'completed' THEN 1 END) as completed_items
      FROM challenge_items ci
      LEFT JOIN student_item_progress sip ON ci.id = sip.challenge_item_id AND sip.attempt_id = ?
      WHERE ci.challenge_id = ?
    `, [attemptId, attempt[0].challenge_id]);

    const { total_items, completed_items } = itemsStatus[0];
    
    if (completed_items < total_items) {
      return res.status(400).json({ 
        message: 'Not all items completed',
        completed: completed_items,
        total: total_items
      });
    }

    // Calculate final stats
    const completion_time = Math.floor((new Date() - new Date(attempt[0].started_at)) / 1000);
    const accuracy = attempt[0].max_points > 0 
      ? (attempt[0].total_points_earned / attempt[0].max_points) * 100 
      : 0;

    // Update attempt status
    await pool.query(`
      UPDATE student_challenge_attempts 
      SET status = 'completed', completed_at = NOW()
      WHERE id = ?
    `, [attemptId]);

    // Update user points
    await pool.query(`
      UPDATE users 
      SET points = points + ?
      WHERE id = ?
    `, [attempt[0].total_points_earned, student_id]);

    // Create leaderboard entry
    await pool.query(`
      INSERT INTO leaderboard_entries 
      (student_id, class_id, challenge_id, points, completion_time_seconds, accuracy_percentage) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      student_id, 
      attempt[0].class_id, 
      attempt[0].challenge_id, 
      attempt[0].total_points_earned, 
      completion_time, 
      accuracy
    ]);

    res.status(200).json({ 
      message: 'Challenge completed successfully!',
      final_score: attempt[0].total_points_earned,
      completion_time_seconds: completion_time,
      accuracy_percentage: accuracy
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getChallengeAttempt,
  startReadingItem,
  completeReadingItem,
  submitQuizAnswers,
  completeChallenge
};