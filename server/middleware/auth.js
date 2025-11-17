const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscription_tier,
      subscriptionStatus: user.subscription_status
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Check if user has paid subscription
const requirePaidAccess = (req, res, next) => {
  if (req.user.subscriptionTier === 'free' || req.user.subscriptionStatus !== 'active') {
    return res.status(403).json({ 
      error: 'Paid subscription required',
      subscriptionTier: req.user.subscriptionTier,
      subscriptionStatus: req.user.subscriptionStatus
    });
  }
  next();
};

// Check subscription tier
const requireTier = (tier) => {
  return (req, res, next) => {
    const tierLevels = { 'free': 0, 'starter': 1, 'professional': 2, 'enterprise': 3 };
    const userTier = tierLevels[req.user.subscriptionTier] || 0;
    const requiredTier = tierLevels[tier] || 0;

    if (userTier < requiredTier || req.user.subscriptionStatus !== 'active') {
      return res.status(403).json({ 
        error: `${tier} subscription required`,
        currentTier: req.user.subscriptionTier
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requirePaidAccess,
  requireTier
};

