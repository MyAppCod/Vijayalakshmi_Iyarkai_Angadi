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


// ==================== ✅ ADD HERE ====================

app.use(cors({
  origin: "https://vijayalakshmi-iyarkai-angadi.vercel.app",
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// app.use((req, res, next) => {
//   // res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

app.options("*", cors());

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