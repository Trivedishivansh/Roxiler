const { Op } = require('sequelize');
const { Store, Rating } = require('../models');

exports.getAllStores = async (req, res, next) => {
  try {
    const { 
      name, 
      address, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    // Get user's ratings for these stores
    const storeIds = stores.map(s => s.id);
    const userRatings = await Rating.findAll({
      where: {
        userId: req.user.id,
        storeId: { [Op.in]: storeIds }
      }
    });

    const userRatingMap = {};
    userRatings.forEach(r => {
      userRatingMap[r.storeId] = r.rating;
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      stores: stores.map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: parseFloat(store.averageRating),
        userSubmittedRating: userRatingMap[store.id] || null,
        totalRatings: store.totalRatings
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.submitRating = async (req, res, next) => {
  const transaction = await require('../models').sequelize.transaction();
  
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await Store.findByPk(storeId, { transaction });
    if (!store) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { userId, storeId },
      transaction
    });

    let ratingRecord;
    if (existingRating) {
      await transaction.rollback();
      return res.status(409).json({ 
        message: 'You have already rated this store. Use PUT to update your rating.' 
      });
    } else {
      ratingRecord = await Rating.create({
        userId,
        storeId,
        rating
      }, { transaction });
    }

    // Update store average rating
    const ratings = await Rating.findAll({
      where: { storeId },
      transaction
    });

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    await store.update({
      averageRating: averageRating.toFixed(2),
      totalRatings: ratings.length
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: {
        id: ratingRecord.id,
        storeId: ratingRecord.storeId,
        rating: ratingRecord.rating,
        createdAt: ratingRecord.createdAt
      },
      storeAverage: parseFloat(averageRating.toFixed(2))
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.updateRating = async (req, res, next) => {
  const transaction = await require('../models').sequelize.transaction();
  
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const existingRating = await Rating.findOne({
      where: { userId, storeId },
      transaction
    });

    if (!existingRating) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Rating not found. Submit a new rating first.' });
    }

    await existingRating.update({ rating }, { transaction });

    // Update store average
    const store = await Store.findByPk(storeId, { transaction });
    const ratings = await Rating.findAll({
      where: { storeId },
      transaction
    });

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    await store.update({
      averageRating: averageRating.toFixed(2),
      totalRatings: ratings.length
    }, { transaction });

    await transaction.commit();

    res.json({
      message: 'Rating updated successfully',
      rating: {
        id: existingRating.id,
        storeId: existingRating.storeId,
        rating: existingRating.rating,
        updatedAt: existingRating.updatedAt
      },
      storeAverage: parseFloat(averageRating.toFixed(2))
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};