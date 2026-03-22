const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// DB
connectDB();

// CORS
const allowedOrigins = [
  'https://vijayalakshmi-iyarkai-angadi.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.includes('vercel.app')
    ) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));

// Middleware
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
}));

app.use(express.json());
app.use(compression());

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

// Test
app.get('/', (req, res) => {
  res.send('API Running...');
});

module.exports = app;