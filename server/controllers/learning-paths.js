const LearningPath = require('../models/LearningPath');

const createLearningPath = async (req, res) => {
  const { title, description, levels } = req.body;
  const teacher_id = req.user.userId;

  try {
    const newLearningPath = new LearningPath({
      title,
      description,
      teacherId: teacher_id,
      levels
    });

    await newLearningPath.save();

    res.status(201).json({ message: 'Learning path created successfully' });
  } catch (error) {
    console.error('Create learning path error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createLearningPath };