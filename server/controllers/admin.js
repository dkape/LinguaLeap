const User = require('../models/User');
const mongoose = require('mongoose');
const transporter = require('../config/mailer');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating password directly via this route for now (or handle hashing if needed)
        delete updates.password;

        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSystemStatus = async (req, res) => {
    try {
        const status = {
            backend: 'connected',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            smtp: 'disconnected'
        };

        try {
            await transporter.verify();
            status.smtp = 'connected';
        } catch (error) {
            console.error('SMTP verify error:', error);
            status.smtpError = error.message;
        }

        res.status(200).json(status);
    } catch (error) {
        console.error('System status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUsers, updateUser, deleteUser, getSystemStatus };
