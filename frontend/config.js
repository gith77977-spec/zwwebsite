// Frontend Configuration File
// This file serves both development and production environments

const isProduction = window.location.protocol === 'https:' || 
                    window.location.hostname !== 'localhost' &&
                    window.location.hostname !== '127.0.0.1';

const API_BASE_URL = isProduction 
  ? `${window.location.protocol}//${window.location.hostname}/api`
  : 'http://localhost:3000/api';

const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  IS_PRODUCTION: isProduction,
  TIMEOUT: 30000,  // 30 seconds
  RETRY_ATTEMPTS: 3,
  
  // Admin credentials (change these after deployment!)
  DEFAULT_USERNAME: 'zonewear2026',
  DEFAULT_PASSWORD: 'Wz2L9MqswZweb',
  
  // Token settings
  TOKEN_KEY: 'zw-admin-token',
  SESSION_KEY: 'zw-admin-session',
  LOGIN_TIME_KEY: 'zw-admin-login-time',
  USERNAME_KEY: 'zw-admin-username',
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/admin/login',
    PROFILE: '/admin/profile',
    PRODUCTS: '/products',
    ORDERS: '/orders',
    BACKUP: '/backup',
    BACKUPS: '/backups',
    HEALTH: '/health'
  }
};

// Helper function to get API endpoint
function getApiUrl(endpoint) {
  return API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS[endpoint];
}

// Detect environment
console.log(`[CONFIG] Environment: ${API_CONFIG.IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`[CONFIG] API Base URL: ${API_CONFIG.BASE_URL}`);
