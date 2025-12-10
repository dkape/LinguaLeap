// MongoDB initialization script for tests
db.createUser({
  user: 'lingualeap',
  pwd: 'test_password',
  roles: [
    {
      role: 'readWrite',
      db: 'lingualeap_test'
    }
  ]
});

db = db.getSiblingDB('lingualeap_test');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        name: {
          bsonType: 'string',
          minLength: 2
        },
        role: {
          enum: ['student', 'teacher']
        }
      }
    }
  }
});

db.createCollection('classes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'teacherId'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1
        },
        teacherId: {
          bsonType: 'objectId'
        }
      }
    }
  }
});

db.createCollection('challenges', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'teacherId', 'classId'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1
        },
        teacherId: {
          bsonType: 'objectId'
        },
        classId: {
          bsonType: 'objectId'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ 'email': 1 }, { unique: true });
db.classes.createIndex({ 'teacherId': 1 });
db.challenges.createIndex({ 'classId': 1 });
db.challenges.createIndex({ 'teacherId': 1 });

// Insert test data for automated tests
db.users.insertMany([
  {
    _id: ObjectId(),
    name: 'Test Teacher',
    email: 'teacher@test.com',
    role: 'teacher',
    isEmailVerified: true
  },
  {
    _id: ObjectId(),
    name: 'Test Student',
    email: 'student@test.com',
    role: 'student',
    isEmailVerified: true
  }
]);