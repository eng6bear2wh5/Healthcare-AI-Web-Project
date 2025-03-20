const authRouter = require('./auth');

function route(app) {
  app.use('/signup', (req, res) => res.render('register'));
  app.use('/login', (req, res) => res.render('login'));
  app.use('/forgot-password', (req, res) => res.render('forgot-password'));
  app.use('/auth', authRouter);
}

module.exports = route;
