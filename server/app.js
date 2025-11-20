const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Security middleware
const { 
  blockSuspiciousIPs, 
  detectBots, 
  strictLimiter,
  sanitizeInput 
} = require('./middleware/security');

// Sandbox middleware - prevents file system access outside project
const { preventSystemInfoLeak } = require('./middleware/sandbox');

// Password authentication
const { 
  sessionConfig, 
  requireAuth, 
  handleLogin, 
  handleLogout, 
  checkAuth,
  loginLimiter 
} = require('./middleware/passwordAuth');
const session = require('express-session');

const app = express();

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Needed for React
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Session middleware (must be before other middleware)
app.use(session(sessionConfig));

// Security middleware
app.use(blockSuspiciousIPs);
app.use(detectBots);
app.use(sanitizeInput);
app.use(preventSystemInfoLeak); // Prevent access to system files

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply strict rate limiting to all routes
app.use(strictLimiter);

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000', 'http://localhost:3000'];
const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === 'true';

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // If ALLOW_ALL_ORIGINS is true, allow all origins (useful for local hosting)
    if (allowAllOrigins) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Robots.txt - Block all crawlers
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /\n');
});

// Health Check (no auth required for monitoring)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication routes (public)
app.get('/api/auth/status', checkAuth);
app.post('/api/auth/login', loginLimiter, handleLogin);
app.post('/api/auth/logout', handleLogout);

// Webhooks (must be before JSON parsing, uses raw body)
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }), require('./webhooks/stripe'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/suburbs', require('./routes/suburbs'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/contact', require('./routes/contact'));

// Serve React app static files (in production)
const reactAppPath = path.join(__dirname, '../react-app/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(reactAppPath)) {
  console.log('Serving React app from:', reactAppPath);
  
  // Serve static files (CSS, JS, images) - no auth required
  app.use(express.static(reactAppPath, {
    setHeaders: (res, path) => {
      // Add security headers to static files
      if (path.endsWith('.html')) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
      }
    }
  }));
  
  // Protect all routes with password authentication
  // Allow login page and static assets
  app.use((req, res, next) => {
    // Allow static assets, login page, and API routes
    if (
      req.path.startsWith('/assets/') ||
      req.path.startsWith('/data/') ||
      req.path === '/login' ||
      req.path.startsWith('/api/') ||
      req.path.startsWith('/webhooks/') ||
      req.path === '/robots.txt' ||
      req.path === '/health'
    ) {
      return next();
    }
    
    // Require authentication for all other routes
    requireAuth(req, res, next);
  });
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Don't serve React app for API routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/webhooks/')) {
      return next();
    }
    res.sendFile(path.join(reactAppPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 Handler (only for API routes if React app is not being served)
if (process.env.NODE_ENV !== 'production' || !fs.existsSync(reactAppPath)) {
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
