const authRouter = require('./auth');
const drugRouter = require('./drug');

function route(app) {
  app.use('/auth', authRouter);
  app.use('/health', drugRouter);
}

module.exports = route;
