
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const REFRESH_API_URL = 'https://uat.americana.rest/bs/uidp/api/v1/idp/refresh';  // Change URL as needed (QA, UAT, PROD)

async function refreshToken(bearerToken, refreshToken) {
  try {
    const fetch = (await import('node-fetch')).default; // Dynamic import

    const response = await fetch(REFRESH_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        // 'refreshToken': refreshToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Refresh Successful:', data);
    return data;
  } catch (error) {
    console.error('Refresh Failed:', error.message);
    throw error;
  }
}

// Example usage with bearer token and refresh token
const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXIiLCJzZXNzaW9uX2lkIjoiekdtSE9BSVFmSmxqd05MT2JSbHVqZ18yMDI1XzAxXzIzXzA4XzEzXzIxMzgyNjEyIiwiaXNfcmVmcmVzaCI6dHJ1ZSwiZXhwIjoxNzM3NzA2NDAxLCJpYXQiOjE3Mzc2MjAwMDEsInNjb3BlcyI6eyJyb2xlcyI6IiJ9LCJhdWQiOiJhbG1wX0lkUDphdXRoIn0.NZuZf0UHwoEAoJZQkuJmx-aFth4BUuHQXj9DDKJcahfF9Np0aFZ_P_6DtuL8cCdI1KxEJbGinDSTfCZQEN7cPJYumrVs5wL8EebpvP9-2gWeGM7HTPkc_04Vxo-E_-seb_E18lZxCBvuY3Xmjh4O4wCjUpRV-w8-IaA9pq-QG6x6aAkSVtmaSSTPxXmASjVektqElHFmCD7e-SF40MPicpmaG2S8HyZ0N_G1ypmH0cdWPw3pAGe53HqZ5atL1TeWR_Vv0dZm4unK7L2dHBxYUDjLr9l0nh-3L2ER3RP0LeEfewMppUqKR0pmA0n30bagbKobza4QB4GvjFT2JZHebXO4756STHa7PYTvj-cvKJpufZUtkWrh3kKZxRWMX8_4PNykbWAo0476E_j3IKZTdr1OwZxjHx4D0RdzBCPp8mk9IGiZh0S5vy9L6syYErSsZ2Yzd2owWEEV2ku-PeyGkTwOJBUB6TPdPOjxaCoTrxjfuuB1EmSV-xDvbpg11y6Dx2ztzQVidxTAXa21lvG1fe-dZvDxEGphvdQrmF18UzQipxbw-uFq0GdTraiadQEEgvbDlVO3WlvIi_VgCcWMflUal0VmS1QT2HbmvWIK7BxIxL4Rip9TCKv-IXjnmzQxwk50jwi-PS-TEeVNeeOrtRzeiDojhBEV25kPesENfp8';  // Replace with actual Bearer token
// const refreshToken = 'your-refresh-token';  // Replace with actual Refresh token

refreshToken(bearerToken, refreshToken)
  .then(console.log)
  .catch(console.error);
