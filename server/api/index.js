const fileApi = require('./file');

function api(server) {
  server.use('/api/v1/files', fileApi);
}

module.exports = api;
