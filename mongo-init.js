// MongoDB initialization script
db = db.getSiblingDB('lingualeap');

// Create application user
db.createUser({
  user: 'lingualeap',
  pwd: 'password_placeholder', // Change this in production!
  roles: [
    {
      role: 'readWrite',
      db: 'lingualeap'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "uid": 1 }, { unique: true });
db.users.createIndex({ "emailVerificationToken": 1 });

db.studentclasses.createIndex({ "teacherId": 1 });
db.studentclasses.createIndex({ "students": 1 });

db.challenges.createIndex({ "teacherId": 1 });
db.challenges.createIndex({ "classId": 1 });
db.challenges.createIndex({ "isActive": 1 });

db.challengeattempts.createIndex({ "studentId": 1, "challengeId": 1 }, { unique: true });
db.challengeattempts.createIndex({ "studentId": 1 });
db.challengeattempts.createIndex({ "challengeId": 1 });

db.leaderboardentries.createIndex({ "classId": 1, "points": -1 });
db.leaderboardentries.createIndex({ "studentId": 1 });
