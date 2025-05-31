// 1. Load environment variables
require('dotenv').config();

// 2. Import libraries
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const errorHandler = require('./middleware/handleError');

// 3. Import routes
const route = require('./routes');

// 4. Import DB connectors
const connectDB = require('./config/db/mongoDB');
const { checkElasticsearchConnection } = require('./config/db/elasticsearch');
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
  app.use(bodyParser.json());                                 // Parser body form
  app.use(methodOverride('_method'));                         // Override methods
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

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
  
  // 9. API routes
  route(app); // Initialize routes


  // 11. Error handling (should be last)
  app.use(errorHandler);

  // 12. Start server
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
})();