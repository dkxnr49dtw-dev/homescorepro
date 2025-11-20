const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || require('crypto').randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevents XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  },
  name: 'homescorepro.sid' // Don't use default session name
};

// Password hash (stored in env, will be set on first run)
const getPasswordHash = () => {
  return process.env.SITE_PASSWORD_HASH || null;
};

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  }
  
  // For API requests, return JSON
  if (req.path.startsWith('/api/') || req.headers['content-type']?.includes('application/json')) {
    return res.status(401).json({ 
      error: 'Authentication required',
      requiresPassword: true 
    });
  }
  
  // For web requests, redirect to login
  res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
};

// Login handler
const handleLogin = async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ 
      error: 'Password is required' 
    });
  }
  
  const passwordHash = getPasswordHash();
  
  if (!passwordHash) {
    console.error('⚠️  SITE_PASSWORD_HASH not set in environment variables!');
    return res.status(500).json({ 
      error: 'Server not configured. Please set SITE_PASSWORD_HASH in environment variables.' 
    });
  }
  
  try {
    const isValid = await bcrypt.compare(password, passwordHash);
    
    if (isValid) {
      req.session.authenticated = true;
      req.session.loginTime = new Date();
      req.session.loginIP = req.ip;
      
      const redirect = req.query.redirect || '/';
      return res.json({ 
        success: true, 
        redirect: redirect 
      });
    } else {
      return res.status(401).json({ 
        error: 'Invalid password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Login failed' 
    });
  }
};

// Logout handler
const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
};

// Check auth status
const checkAuth = (req, res) => {
  res.json({ 
    authenticated: !!(req.session && req.session.authenticated) 
  });
};

module.exports = {
  sessionConfig,
  requireAuth,
  handleLogin,
  handleLogout,
  checkAuth,
  loginLimiter
};

