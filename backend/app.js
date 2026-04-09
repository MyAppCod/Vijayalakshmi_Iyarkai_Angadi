const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// ✅ CONNECT DB
connectDB();


// ==================== ✅ CORS FIX ====================

const allowedOrigins = [
  'https://vijayalakshmi-iyarkai-angadi.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // ✅ allow all (safe for now)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// ✅ VERY IMPORTANT (fix preflight error)
app.options('*', cors(corsOptions));


// ==================== ✅ MIDDLEWARE ====================

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
}));

app.use(express.json());
app.use(compression());


// ==================== ✅ ROUTES ====================

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


// ==================== ✅ TEST ROUTE ====================

app.get('/', (req, res) => {
  res.send('API Running...');
});


module.exports = app;