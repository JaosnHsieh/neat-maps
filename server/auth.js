const _ = require('lodash');

const fetch = require('isomorphic-unfetch');
const qs = require('querystring');
const debug = require('debug')('neat-maps:server:auth.js');

function auth(server) {
  server.get('/isAuthed', (req, res) => {
    if (_.has(req, 'session.user.id')) {
      return res.status(200).send('OK');
    }
    return res.status(401).send('Unauthorized');
  });

  server.post('/login', async (req, res, next) => {
    try {
      const { email = '', password = '' } = req.body;
      const fetchResponse = await fetch('http://neat-mvp-api.herokuapp.com/v1/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify({ email, password }),
      });
      debug('fetchResponse', fetchResponse);

      if (!fetchResponse.ok) {
        return res.status(404).send('Not found');
      }

      const userData = await fetchResponse.json();

      // eslint-disable-next-line require-atomic-updates
      req.session.user = { id: _.get(userData, 'id') };
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  });

  server.post('/logout', async (req, res, next) => {
    try {
      delete req.session.user;
      return res.redirect('/');
    } catch (err) {
      next(err);
    }
  });
}

module.exports = auth;
