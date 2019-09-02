const server = require('./server');

server.listen(process.env.PORT || 3000, () => {
  console.log(`Express server listening to ${process.env.PORT || 3000}`);
});
