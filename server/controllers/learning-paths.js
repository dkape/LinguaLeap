
const pool = require('../config/db');

const createLearningPath = async (req, res) => {
  const { title, description, levels } = req.body;
  const teacher_id = req.user.userId;

  try {
    const [result] = await pool.query(
      'INSERT INTO learning_paths (title, description, teacher_id) VALUES (?, ?, ?)',
      [title, description, teacher_id]
    );

    const learningPathId = result.insertId;

    for (const level of levels) {
      await pool.query(
        'INSERT INTO learning_path_items (learning_path_id, type, content, order_index) VALUES (?, ?, ?, ?)',
        [learningPathId, level.type, level.content, level.order_index]
      );
    }

    res.status(201).json({ message: 'Learning path created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createLearningPath };
