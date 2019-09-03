import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import { postData, SERVER_URL } from './utils';

const Auth = ({ isAuthed, setIsAuthed }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkIsLogin = async () => {
      try {
        const fetchResponse = await fetch(`${SERVER_URL}/isAuthed`, {
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
      setIsLoading(true);
      const fetchResponse = await postData(`${SERVER_URL}/login`, { email, password });
      setIsLoading(false);
      setIsError(!fetchResponse.ok);
      setIsAuthed(fetchResponse.ok);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      console.log(err);
    }
  };
  if (!isChecking && !isAuthed) {
    return (
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            setIsError(false);
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
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <button type="submit" disabled={isLoading}>
            Submit
          </button>
          {isLoading && <div>loading...</div>}
          {isError && <div>error...</div>}
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
