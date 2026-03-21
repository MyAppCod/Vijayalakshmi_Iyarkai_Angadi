const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// DB Connection
connectDB();

// Middleware
// Remove trailing slash from CLIENT_URL if present
const clientURL = process.env.CLIENT_URL?.replace(/\/$/, '');

// CORS setup
app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser requests like Postman
    if (!origin) return callback(null, true); 
    
    if (origin === clientURL) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed for this origin'), false);
    }
  },
  credentials: true,       // allow cookies/auth headers
  optionsSuccessStatus: 200 // for legacy browsers preflight
}));

// Handle preflight requests for all routes
app.options('*', cors({
  origin: clientURL,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000
}));

// Body parser
app.use(express.json());

// Routes
app.use(express.static('frontend/build'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/uploads', express.static('uploads'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use(require('compression')());

// Test route
app.get('/', (req, res) => {
  res.send('API Running...');
});

module.exports = app;