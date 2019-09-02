const server = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const auth = require('./auth');
const api = require('./api');

server.use(morgan('dev'));
server.use(
  cors({
    origin: function(origin, callback) {
      process.env.NODE_ENV === 'dev' ? callback(null, true) : callback(new Error('Not Allowed'));
    },
    credentials: process.env.NODE_ENV === 'dev' ? true : false,
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
