const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, Store, Rating, sequelize } = require('../models');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Verify owner exists and is a Store Owner
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Create store
    const store = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    res.status(201).json({
      message: 'Store created successfully',
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        averageRating: store.averageRating,
        totalRatings: store.totalRatings,
        createdAt: store.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllStores = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      address, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      stores: stores.map(store => ({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: parseFloat(store.averageRating),
        totalRatings: store.totalRatings,
        owner: store.owner
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      address, 
      role,
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };
    if (role) whereClause.role = role;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      users
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Store,
        as: 'ownedStores',
        attributes: ['id', 'name', 'averageRating', 'totalRatings']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    if (user.role === 'Store Owner' && user.ownedStores.length > 0) {
      response.stores = user.ownedStores.map(store => ({
        id: store.id,
        name: store.name,
        rating: parseFloat(store.averageRating),
        totalRatings: store.totalRatings
      }));
      response.overallRating = user.ownedStores.reduce((acc, store) => 
        acc + (parseFloat(store.averageRating) * store.totalRatings), 0) / 
        user.ownedStores.reduce((acc, store) => acc + store.totalRatings, 0) || 0;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};