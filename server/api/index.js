const { fileRouter } = require('./file');

function api(server) {
  server.use('/api/v1/files', fileRouter);
}

module.exports = api;
