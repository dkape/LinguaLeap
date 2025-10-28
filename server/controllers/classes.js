const StudentClass = require('../models/StudentClass');
const User = require('../models/User');

// Create a new student class
const createClass = async (req, res) => {
  const { name, description, language, age_range } = req.body;
  const teacher_id = req.user.userId;

  try {
    if (!name || !language) {
      return res.status(400).json({ message: 'Name and language are required' });
    }

    const newClass = new StudentClass({
      name,
      description,
      teacherId: teacher_id,
      language,
      ageRange: age_range,
      students: []
    });

    const savedClass = await newClass.save();

    res.status(201).json({ 
      message: 'Class created successfully',
      classId: savedClass._id
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all classes for a teacher
const getTeacherClasses = async (req, res) => {
  const teacher_id = req.user.userId;

  try {
    const classesData = await StudentClass.find({ teacherId: teacher_id })
      .sort({ createdAt: -1 })
      .lean();

    const classes = classesData.map(c => ({
      ...c,
      student_count: c.students ? c.students.length : 0
    }));

    res.status(200).json({ classes });
  } catch (error) {
    console.error('Get teacher classes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get class details with students
const getClassDetails = async (req, res) => {
  const { classId } = req.params;
  const teacher_id = req.user.userId;

  try {
    const studentClass = await StudentClass.findOne({ _id: classId, teacherId: teacher_id })
      .populate('students', 'name email avatarUrl points');

    if (!studentClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json({ 
      class: studentClass,
      students: studentClass.students 
    });
  } catch (error) {
    console.error('Get class details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add student to class
const addStudentToClass = async (req, res) => {
  const { classId } = req.params;
  const { studentEmail } = req.body;
  const teacher_id = req.user.userId;

  try {
    const student = await User.findOne({ email: studentEmail, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updatedClass = await StudentClass.findOneAndUpdate(
      { _id: classId, teacherId: teacher_id },
      { $addToSet: { students: student._id } }, // $addToSet prevents duplicates
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found or you do not have permission' });
    }

    res.status(200).json({ message: 'Student added to class successfully' });
  } catch (error) {
    console.error('Add student to class error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove student from class
const removeStudentFromClass = async (req, res) => {
  const { classId, studentId } = req.params;
  const teacher_id = req.user.userId;

  try {
    const updatedClass = await StudentClass.findOneAndUpdate(
      { _id: classId, teacherId: teacher_id },
      { $pull: { students: studentId } }, // $pull removes the student
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found or you do not have permission' });
    }

    res.status(200).json({ message: 'Student removed from class successfully' });
  } catch (error) {
    console.error('Remove student from class error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get classes for a student
const getStudentClasses = async (req, res) => {
  const student_id = req.user.userId;

  try {
    const classes = await StudentClass.find({ students: student_id })
      .populate('teacherId', 'name')
      .lean();

    const result = classes.map(c => ({
      ...c,
      teacher_name: c.teacherId.name,
      classmate_count: c.students ? c.students.length : 0
    }));

    res.status(200).json({ classes: result });
  } catch (error) {
    console.error('Get student classes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createClass,
  getTeacherClasses,
  getClassDetails,
  addStudentToClass,
  removeStudentFromClass,
  getStudentClasses
};
