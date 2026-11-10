const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const petProfileRoutes = require('./routes/petProfileRoutes');
const brandRoutes = require('./routes/brandRoutes');
const cartRoutes = require('./routes/cartRoutes');
const couponRoutes = require('./routes/couponRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header, e.g. Vite proxy / curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Basic rate limiting for auth & contact endpoints (50 requests / 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' },
});
app.use('/api/users', (req, res, next) => (req.method === 'POST' ? authLimiter(req, res, next) : next()));
app.use('/api/contact', (req, res, next) => (req.method === 'POST' ? authLimiter(req, res, next) : next()));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/pets', petProfileRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
