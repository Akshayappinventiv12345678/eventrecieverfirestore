const FormData = require('form-data');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
async function login(username, password, appId) {
  // Dynamically import node-fetch
  const fetch = (await import('node-fetch')).default; // Dynamic import

  const LOGIN_API_URL = 'https://uat.americana.rest/bs/uidp/api/v4/idp/login';
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);
  form.append('appId', appId);

  try {
    const response = await fetch(LOGIN_API_URL, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Login Successful:', data);
    return data;
  } catch (error) {
    console.error('Login Failed:', error.message);
    throw error;
  }
}

const username = 'test_user';
const password = 'Password@123';
const appId = '9';

login(username, password, appId).then(console.log).catch(console.error);
