// require('dotenv').config(); 
// const express = require('express'); 
// const cookieParser = require('cookie-parser');  
// const morgan = require('morgan');
// const methodOverride = require('method-override');
// const passport = require('./config/passport');
// const errorHandler = require('./middleware/handleError');
// const cors = require('cors');
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const path = require('path');
// require('./config/db/mongoDB'); // Kết nối MongoDB

// // Import các route
// const articlesRoute = require('./routes/articles');
// const diseasesRoute = require('./routes/diseases');
// const groupDiseasesRoute = require('./routes/groupDiseases');
// const adminsRoute = require('./routes/admins');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// const port = 3300;


// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use(express.json());

// // API routes
// app.use('/api/articles', articlesRoute);
// app.use('/api/diseases', diseasesRoute);
// app.use('/api/group_diseases', groupDiseasesRoute);
// // app.use('/api/admins', adminsRoute);
// app.get('/articles_by_group.html', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public', 'articles_by_group.html'))
// );

// // Web routes
// app.get('/DISEASES', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'diseases.html'));
// });
// app.get('/DISEASES/:diseaseName', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'diseaseDetail.html'));
// });
// app.get('/ADMIN', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'admin_home.html'));
// });
// app.get('/admin_diseases', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'admin_diseases.html'));
// });
// app.get('/ADD_DISEASE', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'add_disease.html'));
// });
// app.get('/ADD_GROUP', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'add_group.html'));
// });
// app.get('/admin_group_diseases', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'admin_group_diseases.html'));
// });
// app.get('/articles', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'articles.html'));
// });

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
// // });


// app.use(
//   express.urlencoded({
//     extended: true,
//   }),
// );

// app.use(express.json());

// app.use(morgan('combined'));

// app.use(cors({
//   origin: 'http://localhost:5173', 
//   credentials: true, 
// }));

// app.use(cookieParser());

// app.use(methodOverride('_method'));

// app.use(session({
//   secret: process.env.SESSION_KEY,       
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     secure: false, // nếu dùng HTTPS thì đặt true
//     sameSite: 'lax', // hoặc 'none' nếu dùng HTTPS và cần cross-site
//     maxAge: 3 * 60 * 1000
//   },
// }));

// app.use(passport.initialize()); 

// app.use(errorHandler);

// const connectDB = require('./config/db/mongoDB');
// connectDB();

// const { checkElasticsearchConnection } = require('./config/db/elasticsearch');
// checkElasticsearchConnection();

// const route = require('./routes'); 
// route(app);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport setup
const passport = require('./config/passport');

// Database connections
const connectMongo = require('./config/db/mongoDB');
const { checkElasticsearchConnection } = require('./config/db/elasticsearch');

// Route imports
const articlesRoute = require('./routes/articles');
const diseasesRoute = require('./routes/diseases');
const groupDiseasesRoute = require('./routes/groupDiseases');
const adminsRoute = require('./routes/admins');



// Connect to databases
connectMongo();
checkElasticsearchConnection();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(morgan('combined'));

// Session and Passport
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session && passport.session());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/articles', articlesRoute);
app.use('/api/diseases', diseasesRoute);
app.use('/api/group_diseases', groupDiseasesRoute);
app.use('/api/admins', adminsRoute);

// Web page routes
// app.get('/articles_by_group.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'articles_by_group.html')));
// app.get('/DISEASES', (req, res) => res.sendFile(path.join(__dirname, 'public', 'diseases.html')));
// app.get('/DISEASES/:diseaseName', (req, res) => res.sendFile(path.join(__dirname, 'public', 'diseaseDetail.html')));
// app.get('/ADMIN', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin_home.html')));
// app.get('/admin_diseases', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin_diseases.html')));
// app.get('/ADD_DISEASE', (req, res) => res.sendFile(path.join(__dirname, 'public', 'add_disease.html')));
// app.get('/ADD_GROUP', (req, res) => res.sendFile(path.join(__dirname, 'public', 'add_group.html')));
// app.get('/admin_group_diseases', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin_group_diseases.html')));
// app.get('/articles', (req, res) => res.sendFile(path.join(__dirname, 'public', 'articles.html')));

// Error handling middleware
app.use(require('./middleware/handleError'));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
