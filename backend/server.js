const express = require('express');
const querystring = require('querystring');

const app = express();
const PORT = 5000;

const clientID = '';
const clientSecret = '';

app.get('/auth/github', (req, res) => {
  const redirect_uri = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=repo,read:org`;
  res.redirect(redirect_uri);
});

app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  const tokenResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    }
  );

  let data = await tokenResponse.json();
  const accessToken = data.access_token;
 
  const response = await fetch('https://api.github.com/user',
    {
      headers: { Authorization: `token ${accessToken}`}
    }
  );

  data = await response.json();
  const username = data.name; 

  res.redirect(`http://localhost:5173/home?githubToken=${accessToken}&username=${username}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
