const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  subscription_tier: {
    type: DataTypes.STRING(50),
    defaultValue: 'free'
  },
  subscription_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'inactive'
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_reset_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stripe_customer_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Property Model
const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  suburb: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  postcode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  property_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  land_size: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bathrooms: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true
  },
  street_quality: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  renovation_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  hampz_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  gahee_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  b_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  is_favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'properties',
  timestamps: true,
  createdAt: 'date_added',
  updatedAt: 'updated_at'
});

// Subscription Model
const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  stripe_subscription_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  stripe_customer_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  plan: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  current_period_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  current_period_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancel_at_period_end: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'subscriptions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Payment Model
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  subscription_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'subscriptions', key: 'id' }
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'AUD'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// User Preferences Model
const UserPreferences = sequelize.define('UserPreferences', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' }
  },
  primary_goal: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  budget_min: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  budget_max: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  family_status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  safety_priority: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  geographic_categories: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  consensus_scoring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  onboarding_complete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_preferences',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Search History Model
const SearchHistory = sequelize.define('SearchHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  search_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  search_query: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  results_count: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'search_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Favorite Suburb Model
const FavoriteSuburb = sequelize.define('FavoriteSuburb', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  suburb_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  postcode: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'favorite_suburbs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Contact Submission Model
const ContactSubmission = sequelize.define('ContactSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { isEmail: true }
  },
  subject: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'new'
  }
}, {
  tableName: 'contact_submissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Define associations
User.hasMany(Property, { foreignKey: 'user_id', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Subscription, { foreignKey: 'user_id', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(UserPreferences, { foreignKey: 'user_id', as: 'preferences' });
UserPreferences.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(SearchHistory, { foreignKey: 'user_id', as: 'searchHistory' });
SearchHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(FavoriteSuburb, { foreignKey: 'user_id', as: 'favoriteSuburbs' });
FavoriteSuburb.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Subscription.hasMany(Payment, { foreignKey: 'subscription_id', as: 'payments' });
Payment.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });

module.exports = {
  User,
  Property,
  Subscription,
  Payment,
  UserPreferences,
  SearchHistory,
  FavoriteSuburb,
  ContactSubmission
};


