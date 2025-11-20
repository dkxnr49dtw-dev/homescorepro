const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Track suspicious IPs
const suspiciousIPs = new Map();
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour
const SUSPICIOUS_THRESHOLD = 10; // 10 suspicious requests

// Enhanced rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    markSuspicious(req.ip);
    res.status(429).json({ 
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: Math.ceil(15 * 60 / 1000) // seconds
    });
  }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 contact form submissions per hour
  message: 'Too many contact form submissions, please try again later.',
  handler: (req, res) => {
    markSuspicious(req.ip);
    res.status(429).json({ 
      error: 'Too many contact form submissions, please try again later.' 
    });
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many API requests, please try again later.',
  handler: (req, res) => {
    markSuspicious(req.ip);
    res.status(429).json({ 
      error: 'Too many API requests, please try again later.' 
    });
  }
});

// Strict rate limiter for general routes
const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests, please slow down.',
  handler: (req, res) => {
    markSuspicious(req.ip);
    res.status(429).json({ 
      error: 'Too many requests, please slow down.' 
    });
  }
});

// Mark IP as suspicious
function markSuspicious(ip) {
  const now = Date.now();
  const record = suspiciousIPs.get(ip) || { count: 0, firstSeen: now, blockedUntil: 0 };
  
  record.count++;
  record.lastSeen = now;
  
  if (record.count >= SUSPICIOUS_THRESHOLD) {
    record.blockedUntil = now + BLOCK_DURATION;
    console.warn(`⚠️  IP ${ip} marked as suspicious (${record.count} violations)`);
  }
  
  suspiciousIPs.set(ip, record);
}

// Check if IP is blocked
function isBlocked(ip) {
  const record = suspiciousIPs.get(ip);
  if (!record) return false;
  
  if (record.blockedUntil > Date.now()) {
    return true;
  }
  
  // Clean up old records
  if (record.lastSeen < Date.now() - (24 * 60 * 60 * 1000)) {
    suspiciousIPs.delete(ip);
    return false;
  }
  
  return false;
}

// Block suspicious IPs middleware
const blockSuspiciousIPs = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (isBlocked(ip)) {
    return res.status(403).json({ 
      error: 'Access denied. Your IP has been temporarily blocked due to suspicious activity.' 
    });
  }
  
  next();
};

// Bot detection middleware
const detectBots = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i,
    /scrapy/i,
    /python/i,
    /curl/i,
    /wget/i,
    /postman/i,
    /insomnia/i,
    /httpie/i,
    /go-http-client/i,
    /java/i,
    /node-fetch/i,
    /axios/i
  ];
  
  const isBot = botPatterns.some(pattern => pattern.test(userAgent));
  
  if (isBot && !req.path.startsWith('/api/')) {
    // Allow health check for monitoring
    if (req.path === '/health') {
      return next();
    }
    
    markSuspicious(req.ip);
    return res.status(403).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Access Denied</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
      </head>
      <body>
        <h1>Access Denied</h1>
        <p>Automated access is not permitted. This site requires manual authentication.</p>
      </body>
      </html>
    `);
  }
  
  next();
};

// Input sanitization
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      }
    });
  }
  next();
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validation rules
const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Valid email is required');

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

// Get suspicious IPs (for admin monitoring)
function getSuspiciousIPs() {
  const now = Date.now();
  const active = [];
  
  suspiciousIPs.forEach((record, ip) => {
    if (record.blockedUntil > now || record.count >= SUSPICIOUS_THRESHOLD) {
      active.push({
        ip,
        count: record.count,
        blockedUntil: record.blockedUntil,
        isBlocked: record.blockedUntil > now
      });
    }
  });
  
  return active;
}

module.exports = {
  authLimiter,
  contactLimiter,
  apiLimiter,
  strictLimiter,
  blockSuspiciousIPs,
  detectBots,
  sanitizeInput,
  handleValidationErrors,
  emailValidation,
  passwordValidation,
  markSuspicious,
  isBlocked,
  getSuspiciousIPs
};
