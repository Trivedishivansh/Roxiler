const { Store, Rating, User } = require('../models');

exports.getMyStores = async (req, res, next) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [{
        model: Rating,
        as: 'ratings',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'address']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    const storeData = stores.map(store => ({
      storeId: store.id,
      storeName: store.name,
      email: store.email,
      address: store.address,
      averageRating: parseFloat(store.averageRating),
      totalRatings: store.totalRatings,
      ratedBy: store.ratings.map(r => ({
        userId: r.user.id,
        userName: r.user.name,
        userEmail: r.user.email,
        userAddress: r.user.address,
        rating: r.rating,
        submittedAt: r.createdAt
      }))
    }));

    res.json({
      stores: storeData
    });
  } catch (error) {
    next(error);
  }
};

exports.getStoreDetails = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findOne({
      where: { 
        id: storeId,
        ownerId: req.user.id 
      },
      include: [{
        model: Rating,
        as: 'ratings',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'address']
        }]
      }]
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found or access denied' });
    }

    res.json({
      storeId: store.id,
      storeName: store.name,
      email: store.email,
      address: store.address,
      averageRating: parseFloat(store.averageRating),
      totalRatings: store.totalRatings,
      createdAt: store.createdAt,
      ratings: store.ratings.map(r => ({
        userId: r.user.id,
        userName: r.user.name,
        userEmail: r.user.email,
        userAddress: r.user.address,
        rating: r.rating,
        submittedAt: r.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};