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

const getTeacherLearningPaths = async (req, res) => {
  try {
    const learningPaths = await LearningPath.find({ teacherId: req.user.userId });
    res.json({ learningPaths });
  } catch (error) {
    console.error('Error fetching teacher learning paths:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const toggleLearningPathStatus = async (req, res) => {
  const { pathId } = req.params;
  const teacher_id = req.user.userId;

  try {
    const learningPath = await LearningPath.findOne({ _id: pathId, teacherId: teacher_id });

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found or you do not have permission' });
    }

    learningPath.isActive = !learningPath.isActive;
    await learningPath.save();

    res.status(200).json({ 
      message: `Learning path status updated to ${learningPath.isActive ? 'active' : 'inactive'}`,
      isActive: learningPath.isActive
    });
  } catch (error) {
    console.error('Toggle learning path status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateLearningPath = async (req, res) => {
  const { pathId } = req.params;
  const teacher_id = req.user.userId;
  const { title, description, levels } = req.body;

  try {
    const learningPath = await LearningPath.findOne({ _id: pathId, teacherId: teacher_id });

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found or you do not have permission' });
    }

    // Update fields
    learningPath.title = title || learningPath.title;
    learningPath.description = description || learningPath.description;
    // ... update other fields ...

    await learningPath.save();

    res.status(200).json({ message: 'Learning path updated successfully' });
  } catch (error) {
    console.error('Update learning path error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createLearningPath, getTeacherLearningPaths, toggleLearningPathStatus, updateLearningPath };