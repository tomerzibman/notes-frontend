import { useState } from 'react';

import PropTypes from 'prop-types';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async (event) => {
    event.preventDefault();
    const credentials = {
      username,
      password,
    };
    await handleLogin(credentials);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={doLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={(event) => setUsername(event.target.value)}
          id="username"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={(event) => setPassword(event.target.value)}
          id="password"
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
