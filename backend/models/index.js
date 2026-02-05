const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [20, 60]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
    validate: {
      len: [0, 400]
    }
  },
  role: {
    type: DataTypes.ENUM('System Administrator', 'Normal User', 'Store Owner'),
    allowNull: false,
    defaultValue: 'Normal User'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Store Model
const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [20, 60]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
    validate: {
      len: [0, 400]
    }
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'stores',
  timestamps: true
});

// Rating Model
const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Store,
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'storeId']
    }
  ]
});

// Define Relationships
User.hasMany(Store, { foreignKey: 'ownerId', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating
};