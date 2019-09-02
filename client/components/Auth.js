import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { postData, API_URL } from './utils';

const Auth = ({ isAuthed, setIsAuthed }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkIsLogin = async () => {
      try {
        const fetchResponse = await fetch(`${API_URL}/isAuthed`, {
          credentials: 'include',
        });
        setIsChecking(false);

        setIsAuthed(fetchResponse.ok);
      } catch (err) {
        console.log(err);
      }
    };
    checkIsLogin();
  }, []);

  const login = async () => {
    try {
      const fetchResponse = await postData(`${API_URL}/login`, { email, password });
      setIsAuthed(fetchResponse.ok);
    } catch (err) {
      console.log(err);
    }
  };
  if (!isChecking && !isAuthed) {
    return (
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            await login();
          }}
        >
          <div>
            <input
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <input
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  return null;
};

Auth.propTypes = {
  isAuthed: propTypes.bool,
  setIsAuthed: propTypes.func,
};
export default Auth;
