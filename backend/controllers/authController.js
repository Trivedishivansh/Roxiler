const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Store, Rating, sequelize } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: 'Normal User'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role === 'System Administrator') {
      const [userCount, storeCount, ratingCount] = await Promise.all([
        User.count(),
        Store.count(),
        Rating.count()
      ]);

      return res.json({
        totalUsers: userCount,
        totalStores: storeCount,
        totalRatings: ratingCount
      });
    }

    if (user.role === 'Store Owner') {
      const stores = await Store.findAll({
        where: { ownerId: user.id },
        include: [{
          model: Rating,
          as: 'ratings',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }]
        }]
      });

      const storeData = stores.map(store => ({
        storeId: store.id,
        storeName: store.name,
        averageRating: parseFloat(store.averageRating),
        totalRatings: store.totalRatings,
        ratings: store.ratings.map(r => ({
          userId: r.user.id,
          userName: r.user.name,
          userEmail: r.user.email,
          rating: r.rating,
          createdAt: r.createdAt
        }))
      }));

      return res.json({
        stores: storeData
      });
    }

    res.status(403).json({ message: 'Dashboard not available for this role' });
  } catch (error) {
    next(error);
  }
};