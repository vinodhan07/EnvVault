import axios from 'axios';

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email: 'admin@envvault.com',
      password: 'password123'
    });
    console.log('Login successful!');
    console.log('User role:', response.data.user.role);
    console.log('User status:', response.data.user.status);
    process.exit(0);
  } catch (error) {
    if (error.response) {
      console.error('Login failed with status:', error.response.status);
      console.error('Error info:', error.response.data);
    } else {
      console.error('Login failed:', error.message);
    }
    process.exit(1);
  }
}

testLogin();
