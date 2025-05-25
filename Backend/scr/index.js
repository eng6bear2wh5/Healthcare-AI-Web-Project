const express = require('express'); 
require('dotenv').config(); 
const cookieParser = require('cookie-parser');  
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const errorHandler = require('./middleware/handleError');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

app.use(morgan('combined'));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(cookieParser());

app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_KEY,       
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // nếu dùng HTTPS thì đặt true
    sameSite: 'lax', // hoặc 'none' nếu dùng HTTPS và cần cross-site
    maxAge: 3 * 60 * 1000
  },
}));

app.use(passport.initialize()); 

app.use(errorHandler);

const connectDB = require('./config/db/mongoDB');
connectDB();

const { checkElasticsearchConnection } = require('./config/db/elasticsearch');
checkElasticsearchConnection();

const route = require('./routes'); 
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
