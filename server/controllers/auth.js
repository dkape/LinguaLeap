
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const transporter = require('../config/mailer');

const signup = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either student or teacher' });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = Date.now().toString();
    const avatarUrl = `https://picsum.photos/seed/${uid}/100/100`;
    
    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const [result] = await pool.query(
      'INSERT INTO users (uid, name, email, password, role, avatarUrl, emailVerificationToken, emailVerificationExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uid, name, email, hashedPassword, role, avatarUrl, emailVerificationToken, emailVerificationExpires]
    );

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to LinguaLeap - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to LinguaLeap!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering as a ${role} on LinguaLeap! To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6B7280;">${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <p>Best regards,<br>The LinguaLeap Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      email: email
    });
  } catch (error) {
    console.error('Signup error:', error);
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email address before logging in. Check your inbox for the verification email.',
        emailVerificationRequired: true
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Remove sensitive data before sending user info
    const { password: _, emailVerificationToken: __, ...userInfo } = user;

    res.status(200).json({ token, user: userInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE emailVerificationToken = ? AND emailVerificationExpires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const user = rows[0];

    // Update user as verified and clear verification token
    await pool.query(
      'UPDATE users SET isEmailVerified = TRUE, emailVerificationToken = NULL, emailVerificationExpires = NULL WHERE id = ?',
      [user.id]
    );

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await pool.query(
      'UPDATE users SET emailVerificationToken = ?, emailVerificationExpires = ? WHERE id = ?',
      [emailVerificationToken, emailVerificationExpires, user.id]
    );

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'LinguaLeap - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Verify Your Email Address</h2>
          <p>Hi ${user.name},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6B7280;">${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
          <p>Best regards,<br>The LinguaLeap Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification email sent successfully!' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateLanguagePreference = async (req, res) => {
  const { language } = req.body;

  try {
    if (!language || !['de', 'en'].includes(language)) {
      return res.status(400).json({ message: 'Invalid language. Must be "de" or "en".' });
    }

    await pool.query(
      'UPDATE users SET preferredLanguage = ? WHERE id = ?',
      [language, req.user.userId]
    );

    res.status(200).json({ message: 'Language preference updated successfully' });
  } catch (error) {
    console.error('Update language preference error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const me = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, uid, name, email, role, avatarUrl, points, isEmailVerified, preferredLanguage, createdAt FROM users WHERE id = ?', [req.user.userId]);

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

module.exports = { signup, login, verifyEmail, resendVerification, updateLanguagePreference, me };
