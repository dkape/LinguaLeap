const pool = require('../config/database');

// Create a new student class
const createClass = async (req, res) => {
  const { name, description, language, age_range } = req.body;
  const teacher_id = req.user.userId;

  try {
    if (!name || !language) {
      return res.status(400).json({ message: 'Name and language are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO student_classes (name, description, teacher_id, language, age_range) VALUES (?, ?, ?, ?, ?)',
      [name, description, teacher_id, language, age_range]
    );

    res.status(201).json({ 
      message: 'Class created successfully',
      classId: result.insertId
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
    const [classes] = await pool.query(`
      SELECT 
        sc.*,
        COUNT(cm.student_id) as student_count
      FROM student_classes sc
      LEFT JOIN class_memberships cm ON sc.id = cm.class_id
      WHERE sc.teacher_id = ?
      GROUP BY sc.id
      ORDER BY sc.createdAt DESC
    `, [teacher_id]);

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
    // Get class info
    const [classInfo] = await pool.query(
      'SELECT * FROM student_classes WHERE id = ? AND teacher_id = ?',
      [classId, teacher_id]
    );

    if (classInfo.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Get students in class
    const [students] = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.avatarUrl, u.points,
        cm.joinedAt,
        COALESCE(SUM(sca.total_points_earned), 0) as total_challenge_points
      FROM class_memberships cm
      JOIN users u ON cm.student_id = u.id
      LEFT JOIN student_challenge_attempts sca ON u.id = sca.student_id
      WHERE cm.class_id = ?
      GROUP BY u.id
      ORDER BY total_challenge_points DESC, u.name
    `, [classId]);

    res.status(200).json({ 
      class: classInfo[0],
      students 
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
    // Verify class belongs to teacher
    const [classCheck] = await pool.query(
      'SELECT id FROM student_classes WHERE id = ? AND teacher_id = ?',
      [classId, teacher_id]
    );

    if (classCheck.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find student by email
    const [student] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND role = "student"',
      [studentEmail]
    );

    if (student.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add student to class
    await pool.query(
      'INSERT IGNORE INTO class_memberships (student_id, class_id) VALUES (?, ?)',
      [student[0].id, classId]
    );

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
    // Verify class belongs to teacher
    const [classCheck] = await pool.query(
      'SELECT id FROM student_classes WHERE id = ? AND teacher_id = ?',
      [classId, teacher_id]
    );

    if (classCheck.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await pool.query(
      'DELETE FROM class_memberships WHERE student_id = ? AND class_id = ?',
      [studentId, classId]
    );

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
    const [classes] = await pool.query(`
      SELECT 
        sc.*,
        u.name as teacher_name,
        COUNT(DISTINCT cm2.student_id) as classmate_count
      FROM class_memberships cm
      JOIN student_classes sc ON cm.class_id = sc.id
      JOIN users u ON sc.teacher_id = u.id
      LEFT JOIN class_memberships cm2 ON sc.id = cm2.class_id
      WHERE cm.student_id = ?
      GROUP BY sc.id
      ORDER BY cm.joinedAt DESC
    `, [student_id]);

    res.status(200).json({ classes });
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