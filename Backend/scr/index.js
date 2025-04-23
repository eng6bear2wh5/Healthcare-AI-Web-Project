const express = require('express'); 
require('dotenv').config(); 
const path = require('path'); 
const cookieParser = require('cookie-parser');  
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const errorHandler = require('./middleware/handleError');

const app = express();
const port = 3000;

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

app.use(morgan('combined'));

app.use(cookieParser());

app.use(methodOverride('_method'));

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
