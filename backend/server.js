require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const storeOwnerRoutes = require('./routes/storeOwner');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models (in production, use migrations instead)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Create default admin if not exists
    const { User } = require('./models');
    const bcrypt = require('bcryptjs');
    
    const adminExists = await User.findOne({ 
      where: { email: 'admin@storerating.com' } 
    });

    if (!adminExists) {
      await User.create({
        name: 'System Administrator Default',
        email: 'admin@storerating.com',
        password: await bcrypt.hash('Admin@123456', 10),
        address: 'System Default Address',
        role: 'System Administrator'
      });
      console.log('Default admin user created: admin@storerating.com / Admin@123456');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();