import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [repos, setRepos] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

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