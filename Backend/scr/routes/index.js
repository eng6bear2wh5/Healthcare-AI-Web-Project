const authRouter = require('./auth');
const drugRouter = require('./drug');

const articlesRoute = require('./articles');
const diseasesRoute = require('./diseases');
const groupDiseasesRoute = require('./groupDiseases');
const adminsRoute = require('./admins');
<<<<<<< HEAD
const AIRoutes = require('./AI.routes');
const NewsData = require('./newsData')

=======
const NewsData = require('./newsData')

const AIRoutes = require('./AI.routes');

>>>>>>> a03675c (add elastic remote and AI chatbot)

function route(app) {
  app.use('/api/articles', articlesRoute);
  app.use('/api/diseases', diseasesRoute);
  app.use('/api/group_diseases', groupDiseasesRoute);
  app.use('/api/admins', adminsRoute);
<<<<<<< HEAD
  app.use('/api/AI', AIRoutes);
  app.use('/api/news', NewsData);  

=======
  app.use('/api/news', NewsData);  

  app.use('/api/AI', AIRoutes);

>>>>>>> a03675c (add elastic remote and AI chatbot)
  app.use('/auth', authRouter);
  app.use('/health', drugRouter);

  app.use('/api/user', require('./user'));
  app.use('/api/userinfo', require('./userInfo'));
  app.use('/api/medical-history', require('./medicalHistory'));
  app.use('/api/prescriptions', require('./prescriptions'));
  app.use('/api/health-metrics', require('./healthMetrics'));
  app.use('/api/user-diets', require('./userDiets'));
  
  app.use('/api/personal-tracker', require('./personalTracker'));
  app.use('/api/avatar', require('./avatar'));
}

module.exports = route;
