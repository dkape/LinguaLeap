const User = require('../models/User');

const seedAdmin = async () => {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD; // This will suffer from not being hashed if treated as raw in login, but User model pre-save hashes it.

    if (!adminUsername || !adminPassword) {
        console.log('No Admin credentials provided in environment variables. Skipping Admin seed.');
        return;
    }

    try {
        // Assume username is email for LinguaLeap based on User model
        // Actually User model has name and email. And login uses email.
        // So ADMIN_USERNAME should be an email.

        const existingAdmin = await User.findOne({ email: adminUsername.toLowerCase() });

        if (existingAdmin) {
            console.log(`Admin user ${adminUsername} already exists.`);
            // Optionally update password or ensure role is admin
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated existing user role to admin.');
            }
            return;
        }

        const newAdmin = new User({
            uid: 'admin-' + Date.now(),
            name: 'Admin',
            email: adminUsername.toLowerCase(),
            password: adminPassword,
            role: 'admin',
            isEmailVerified: true
        });

        await newAdmin.save();
        console.log(`Admin user ${adminUsername} created successfully.`);

    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
