
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signup = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = Date.now().toString();
    const avatarUrl = `https://picsum.photos/seed/${uid}/100/100`;

    const [result] = await pool.query(
      'INSERT INTO users (uid, name, email, password, role, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, name, email, hashedPassword, role, avatarUrl]
    );

    const [rows] = await pool.query('SELECT id, uid, name, email, role, avatarUrl, points, createdAt FROM users WHERE id = ?', [result.insertId]);
    const user = rows[0];

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const me = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, uid, name, email, role, avatarUrl, points, createdAt FROM users WHERE id = ?', [req.user.userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signup, login, me };
