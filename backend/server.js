const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { autoCheckExpiries } = require('./services/expiryChecker');
const User = require('./models/User');
const seedData = require('./seed');

dotenv.config();

const app = express();

// Body Parser & CORS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: '*', // Allow all origins for development ease
    credentials: true,
  })
);

// Connect to Database & Auto-seed if empty
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty. Running initial seeder automatically...');
      await seedData();
    }
  } catch (err) {
    console.error('Auto-seed check failed:', err.message);
  }
});

// Periodic Expiry Checker (runs every 60 seconds)
setInterval(async () => {
  await autoCheckExpiries();
}, 60000);

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/pickups', require('./routes/pickupRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Food Management System API is running smoothly.' });
});

// Root fallback
app.get('/', (req, res) => {
  res.send('Smart Food Waste Management System Backend API');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
