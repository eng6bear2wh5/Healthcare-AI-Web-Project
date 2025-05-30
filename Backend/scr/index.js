// 1. Load environment variables
require('dotenv').config();

// 2. Import libraries
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const errorHandler = require('./middleware/handleError');
const compression = require('compression'); 

// 3. Import routes
const articlesRoute = require('./routes/articles');
const diseasesRoute = require('./routes/diseases');
const groupDiseasesRoute = require('./routes/groupDiseases');
const adminsRoute = require('./routes/admins');
const AIRoutes = require('./routes/AI.routes')
const drugsRoute = require('./routes/drug');
const NewData = require('./routes/newData')

// 4. Import DB connectors
const connectDB = require('./config/db/mongoDB');
const { checkElasticsearchConnection } = require('./config/db/elasticsearch');
const route = require('./routes');
// Immediately-Invoked Async Function to bootstrap app
(async () => {
  // 5. Connect to databases
  await connectDB();
  checkElasticsearchConnection();

  // 6. Initialize Express
  const app = express();
  const PORT = process.env.PORT || 3000;

  // 7. Global middleware
  app.use(morgan('combined'));                                // Logging
  app.use(express.json());                                    // Parse JSON
  app.use(express.urlencoded({ extended: true }));            // Parse URL-encoded
  app.use(cookieParser());                                    // Cookie parser
  app.use(methodOverride('_method'));                         // Override methods
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(express.static(path.join(__dirname, 'public')));     // Serve static files

  app.use(compression()); 

  // 8. Session & Passport
  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3 * 60 * 1000 }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  route(app); // Initialize routes

  // 9. API routes
  app.use('/api/articles', articlesRoute);
  app.use('/api/diseases', diseasesRoute);
  app.use('/api/group_diseases', groupDiseasesRoute);
  app.use('/api/admins', adminsRoute);
  app.use('/api/AI', AIRoutes);
  app.use('/api', drugsRoute);  
  app.use('/api', NewData);  

  // 10. Error handling (should be last)
  app.use(errorHandler);

  
  // 11. Start server
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
})();
