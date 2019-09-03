const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const auth = require('./auth');
const api = require('./api');
const server = express();

server.use(express.static(path.join(__dirname, 'build')));
server.use(morgan('dev'));
if (process.env.NODE_ENV !== 'test') {
  server.use(
    cookieSession({
      name: 'session',
      keys: ['randomkey'],
    }),
  );
}
server.use(
  cors({
    origin: function(origin, callback) {
      process.env.NODE_ENV === 'production'
        ? callback(new Error('Not Allowed'))
        : callback(null, true);
    },
    //disable cors on production
    credentials: process.env.NODE_ENV === 'production' ? false : true,
  }),
);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
auth(server);
api(server);

// eslint-disable-next-line no-unused-vars
server.use(function simpleErrorHandler(err, req, res, next) {
  res.status(500).json({ error: err.message || err.toString() });
});

module.exports = server;
