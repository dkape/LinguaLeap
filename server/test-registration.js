const axios = require('axios');
const mysql = require('mysql2/promise');
require('dotenv').config();

const BASE_URL = 'http://localhost:3001';

// Database connection for testing
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test data
const testUsers = [
  {
    name: 'John Teacher',
    email: 'john.teacher@test.com',
    password: 'password123',
    role: 'teacher'
  },
  {
    name: 'Jane Student',
    email: 'jane.student@test.com',
    password: 'password123',
    role: 'student'
  }
];

// Helper function to clean up test data
async function cleanupTestData() {
  try {
    const testEmails = testUsers.map(user => user.email);
    await pool.query('DELETE FROM users WHERE email IN (?)', [testEmails]);
    console.log('✓ Test data cleaned up');
  } catch (error) {
    console.error('Error cleaning up test data:', error.message);
  }
}

// Test user registration
async function testUserRegistration() {
  console.log('\n=== Testing User Registration ===');
  
  for (const user of testUsers) {
    try {
      console.log(`\nTesting registration for ${user.role}: ${user.email}`);
      
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, user);
      
      if (response.status === 201) {
        console.log(`✓ Registration successful for ${user.email}`);
        console.log(`  Message: ${response.data.message}`);
        
        // Verify user was created in database
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [user.email]);
        if (rows.length > 0) {
          const dbUser = rows[0];
          console.log(`✓ User found in database`);
          console.log(`  - ID: ${dbUser.id}`);
          console.log(`  - Name: ${dbUser.name}`);
          console.log(`  - Role: ${dbUser.role}`);
          console.log(`  - Email Verified: ${dbUser.isEmailVerified}`);
          console.log(`  - Has Verification Token: ${!!dbUser.emailVerificationToken}`);
        } else {
          console.log('✗ User not found in database');
        }
      } else {
        console.log(`✗ Registration failed with status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`✗ Registration failed: ${error.response.data.message}`);
      } else {
        console.log(`✗ Registration error: ${error.message}`);
      }
    }
  }
}

// Test duplicate email registration
async function testDuplicateRegistration() {
  console.log('\n=== Testing Duplicate Email Registration ===');
  
  const duplicateUser = { ...testUsers[0] };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, duplicateUser);
    console.log('✗ Duplicate registration should have failed');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✓ Duplicate registration correctly rejected');
      console.log(`  Message: ${error.response.data.message}`);
    } else {
      console.log(`✗ Unexpected error: ${error.message}`);
    }
  }
}

// Test login without email verification
async function testLoginWithoutVerification() {
  console.log('\n=== Testing Login Without Email Verification ===');
  
  const user = testUsers[0];
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: user.email,
      password: user.password
    });
    console.log('✗ Login should have been blocked due to unverified email');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✓ Login correctly blocked for unverified email');
      console.log(`  Message: ${error.response.data.message}`);
    } else {
      console.log(`✗ Unexpected error: ${error.message}`);
    }
  }
}

// Test email verification
async function testEmailVerification() {
  console.log('\n=== Testing Email Verification ===');
  
  const user = testUsers[0];
  
  try {
    // Get verification token from database
    const [rows] = await pool.query('SELECT emailVerificationToken FROM users WHERE email = ?', [user.email]);
    
    if (rows.length === 0) {
      console.log('✗ User not found in database');
      return;
    }
    
    const token = rows[0].emailVerificationToken;
    
    if (!token) {
      console.log('✗ No verification token found');
      return;
    }
    
    console.log('✓ Verification token found, testing verification...');
    
    const response = await axios.get(`${BASE_URL}/api/auth/verify-email?token=${token}`);
    
    if (response.status === 200) {
      console.log('✓ Email verification successful');
      console.log(`  Message: ${response.data.message}`);
      
      // Verify in database
      const [updatedRows] = await pool.query('SELECT isEmailVerified FROM users WHERE email = ?', [user.email]);
      if (updatedRows[0].isEmailVerified) {
        console.log('✓ Email verification status updated in database');
      } else {
        console.log('✗ Email verification status not updated in database');
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(`✗ Email verification failed: ${error.response.data.message}`);
    } else {
      console.log(`✗ Email verification error: ${error.message}`);
    }
  }
}

// Test login after email verification
async function testLoginAfterVerification() {
  console.log('\n=== Testing Login After Email Verification ===');
  
  const user = testUsers[0];
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: user.email,
      password: user.password
    });
    
    if (response.status === 200) {
      console.log('✓ Login successful after email verification');
      console.log(`  User: ${response.data.user.name} (${response.data.user.role})`);
      console.log(`  Token received: ${!!response.data.token}`);
    }
  } catch (error) {
    if (error.response) {
      console.log(`✗ Login failed: ${error.response.data.message}`);
    } else {
      console.log(`✗ Login error: ${error.message}`);
    }
  }
}

// Test resend verification
async function testResendVerification() {
  console.log('\n=== Testing Resend Verification ===');
  
  const user = testUsers[1]; // Use second user who hasn't been verified yet
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/resend-verification`, {
      email: user.email
    });
    
    if (response.status === 200) {
      console.log('✓ Verification email resent successfully');
      console.log(`  Message: ${response.data.message}`);
    }
  } catch (error) {
    if (error.response) {
      console.log(`✗ Resend verification failed: ${error.response.data.message}`);
    } else {
      console.log(`✗ Resend verification error: ${error.message}`);
    }
  }
}

// Test invalid data
async function testInvalidData() {
  console.log('\n=== Testing Invalid Registration Data ===');
  
  const invalidTests = [
    { data: { name: 'Test', email: 'test@test.com', password: 'pass' }, desc: 'Missing role' },
    { data: { name: 'Test', email: 'invalid-email', password: 'pass', role: 'student' }, desc: 'Invalid email format' },
    { data: { name: 'Test', email: 'test@test.com', password: 'pass', role: 'invalid' }, desc: 'Invalid role' },
    { data: { email: 'test@test.com', password: 'pass', role: 'student' }, desc: 'Missing name' }
  ];
  
  for (const test of invalidTests) {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, test.data);
      console.log(`✗ ${test.desc}: Should have failed but got status ${response.status}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(`✓ ${test.desc}: Correctly rejected`);
      } else {
        console.log(`? ${test.desc}: Got status ${error.response?.status || 'unknown'}`);
      }
    }
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting LinguaLeap Registration Tests');
  console.log(`Testing against: ${BASE_URL}`);
  
  try {
    // Clean up any existing test data
    await cleanupTestData();
    
    // Run tests in sequence
    await testUserRegistration();
    await testDuplicateRegistration();
    await testLoginWithoutVerification();
    await testEmailVerification();
    await testLoginAfterVerification();
    await testResendVerification();
    await testInvalidData();
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  } finally {
    // Clean up test data
    await cleanupTestData();
    await pool.end();
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/`);
    return true;
  } catch (error) {
    return false;
  }
}

// Start tests
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm run server:dev');
    process.exit(1);
  }
  
  await runTests();
})();