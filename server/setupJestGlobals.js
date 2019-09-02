const mockSessionUser = (server, sessionValue) => {
  const mockServer = require('express')();
  const cookieSession = require('cookie-session');
  mockServer.use(
    cookieSession({
      name: 'session',
      keys: ['randomkey'],
    }),
  );
  mockServer.all('*', function(req, res, next) {
    req.session.user = sessionValue;
    next();
  });
  mockServer.use(server);
  return mockServer;
};

global.mockSessionUser = mockSessionUser;
