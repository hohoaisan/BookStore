import React, { useState } from 'react';
import { RootState } from 'stores/store';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from 'reducers/auth';
const Auth = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  if (user) {
    return <p>Logged in as {JSON.stringify(user)}</p>;
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(
            login({
              username,
              password,
            }),
          );
        }}
      >
        <input
          name="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></input>
        <input
          name="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Auth;
