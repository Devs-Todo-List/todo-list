// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*eslint-disable*/
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

const HomePage = () => {
  const [repos, setRepos] = useState([]);

  const navigate = useNavigate();
  var idToken = parseJwt(sessionStorage.idToken.toString());
  var accessToken = parseJwt(sessionStorage.accessToken.toString());
  console.log ("Amazon Cognito ID token encoded: " + sessionStorage.idToken.toString());
  console.log ("Amazon Cognito ID token decoded: ");
  console.log ( idToken );
  console.log ("Amazon Cognito access token encoded: " + sessionStorage.accessToken.toString());
  console.log ("Amazon Cognito access token decoded: ");
  console.log ( accessToken );
  console.log ("Amazon Cognito refresh token: ");
  console.log ( sessionStorage.refreshToken );
  console.log ("Amazon Cognito example application. Not for use in production applications.");
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
/*eslint-enable*/

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:5000/auth/github';
  }

  const displayRepos = async () => {
    const githubToken = localStorage.getItem('githubToken');
    const username = localStorage.getItem('username');
    const response = await fetch(`https://api.github.com/user/repos`,
      {
        headers: { Authorization: `token ${githubToken}`}
      }
    );

    const data = await response.json();
    //console.log(data);
    setRepos(data);
  }

  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  useEffect(() => {
    const githubToken = getQueryParam('githubToken');
    if(githubToken)
    {
      localStorage.setItem('githubToken', githubToken);
    }

    const username = getQueryParam('username');
    if(username)
    {
      localStorage.setItem('username', username);
    }

    window.history.replaceState({}, document.title, '/home');
  }, []);

  useEffect(() => {
    console.log("Repos:", repos);
  }, [repos])

  return (
    <div>
      <h1>Hello World</h1>
      <p>See console log for Amazon Cognito user tokens.</p>
      <button onClick={handleGithubLogin}>Connect Github Account</button>
      <button onClick={displayRepos}>Show repos</button>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {repos.map((repo) => {
          return <div key={repo.id}>{repo.full_name}</div>
        })}
      </div>
    </div>
  );
};

export default HomePage;