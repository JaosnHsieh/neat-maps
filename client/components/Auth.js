import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import { postData, SERVER_URL } from './utils';

const Auth = ({ isAuthed, setIsAuthed }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
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
        setIsError(true);
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
        <div style={{ marginTop: '80px', marginBottom: '80px' }}>
          <form
            onSubmit={async e => {
              e.preventDefault();
              setIsError(false);
              await login();
            }}
            style={{
              maxWidth: '380px',
              padding: '15px 35px 45px',
              margin: '0 auto',
              backgroundColor: '#fff',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <h2>neat maps</h2>
            <div>
              auth by <a href="https://neat-api-docs.herokuapp.com/#authentication">api</a>
            </div>

            <input
              type="text"
              style={{
                position: 'relative',
                fontSize: '16px',
                height: 'auto',
                padding: '10px',
                WebkitBoxSizing: 'border-box',
                MozBoxSizing: 'border-box',
                boxSizing: 'border-box',
                width: '100%',
                marginTop: '10px',
              }}
              name="email"
              placeholder="Email Address"
              autoFocus
              id="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              style={{
                position: 'relative',
                fontSize: '16px',
                height: 'auto',
                padding: '10px',
                WebkitBoxSizing: 'border-box',
                MozBoxSizing: 'border-box',
                boxSizing: 'border-box',
                width: '100%',
              }}
              id="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
              name="password"
              placeholder="Password"
            />
            <div>
              <button
                type="submit"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: '18px',
                  marginTop: '10px',
                  lineHeight: '1.33',
                }}
              >
                Login
              </button>
            </div>
            {isLoading && <div>loading...</div>}
            {isError && <div>error...</div>}
          </form>
        </div>
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
