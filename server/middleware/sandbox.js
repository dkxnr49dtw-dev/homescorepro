const path = require('path');
const fs = require('fs');

// Allowed directories - server can ONLY access these
const ALLOWED_DIRECTORIES = [
  path.join(__dirname, '..'), // Server directory only
  path.join(__dirname, '../../react-app/dist'), // React build only
  path.join(__dirname, '../../data'), // Data directory only (if exists)
];

// Blocked patterns - prevent access to sensitive locations
const BLOCKED_PATTERNS = [
  /\.\./, // Prevent directory traversal
  /\/Users\/[^/]+\/Library\/Mobile Documents\/com~apple~CloudDocs/, // iCloud Drive
  /\/Users\/[^/]+\/Documents/, // User Documents
  /\/Users\/[^/]+\/Desktop/, // Desktop
  /\/Users\/[^/]+\/Downloads/, // Downloads
  /\/etc/, // System config
  /\/var/, // System vars
  /\/private/, // Private system files
  /\/System/, // System files
  /\/Library/, // System Library
  /\.ssh/, // SSH keys
  /\.env/, // Environment files
  /\.git/, // Git files
  /node_modules/, // Dependencies (read-only access only)
];

/**
 * Sanitize file path - prevent directory traversal and access to sensitive locations
 */
function sanitizePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  // Resolve to absolute path
  let resolvedPath = path.resolve(filePath);

  // Check for directory traversal attempts
  if (filePath.includes('..')) {
    throw new Error('Directory traversal not allowed');
  }

  // Check blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(resolvedPath)) {
      throw new Error('Access to this location is not allowed');
    }
  }

  // Check if path is within allowed directories
  const isAllowed = ALLOWED_DIRECTORIES.some(allowedDir => {
    const relative = path.relative(allowedDir, resolvedPath);
    return !relative.startsWith('..') && !path.isAbsolute(relative);
  });

  if (!isAllowed) {
    throw new Error('Access to this directory is not allowed');
  }

  return resolvedPath;
}

/**
 * Safe file read - only allows reading from allowed directories
 */
function safeReadFile(filePath, options = {}) {
  const sanitizedPath = sanitizePath(filePath);
  return fs.readFileSync(sanitizedPath, options);
}

/**
 * Safe file write - only allows writing to allowed directories
 */
function safeWriteFile(filePath, data, options = {}) {
  const sanitizedPath = sanitizePath(filePath);
  
  // Additional check: prevent writing outside project directory
  const projectRoot = path.join(__dirname, '../..');
  const relative = path.relative(projectRoot, sanitizedPath);
  
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Writing outside project directory is not allowed');
  }
  
  return fs.writeFileSync(sanitizedPath, data, options);
}

/**
 * Safe directory listing - only lists allowed directories
 */
function safeReadDir(dirPath) {
  const sanitizedPath = sanitizePath(dirPath);
  return fs.readdirSync(sanitizedPath);
}

/**
 * Middleware to prevent access to sensitive system information
 */
function preventSystemInfoLeak(req, res, next) {
  // Block requests that might try to access system info
  const suspiciousPaths = [
    '/etc/passwd',
    '/etc/hosts',
    '/proc/',
    '/sys/',
    '/var/log/',
    '/.env',
    '/.ssh/',
  ];

  const requestedPath = req.path.toLowerCase();
  
  for (const suspicious of suspiciousPaths) {
    if (requestedPath.includes(suspicious)) {
      console.warn(`⚠️  Blocked suspicious path access: ${req.path} from ${req.ip}`);
      return res.status(403).json({ error: 'Access denied' });
    }
  }

  next();
}

module.exports = {
  sanitizePath,
  safeReadFile,
  safeWriteFile,
  safeReadDir,
  preventSystemInfoLeak,
  ALLOWED_DIRECTORIES,
  BLOCKED_PATTERNS
};

