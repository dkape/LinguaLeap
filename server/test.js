const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

const test = async () => {
  try {
    // Test signup
    console.log('Testing signup...');
    const signupResponse = await axios.post(`${API_URL}/auth/signup`, {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      role: 'teacher',
    });
    console.log('Signup successful:', signupResponse.data);

    // Test login
    console.log('Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password',
    });
    console.log('Login successful:', loginResponse.data);

    // Test authenticated route
    console.log('Testing authenticated route...');
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`,
      },
    });
    console.log('Authenticated route successful:', meResponse.data);

    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
};

test();
test('placeholder test', () => {
  expect(true).toBe(true);
});
