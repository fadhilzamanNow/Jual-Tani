// Screenshot Configuration
// Customize this file to match your app's pages and test accounts

export const config = {
  // Base URL of your application
  baseUrl: 'http://localhost:3000',

  // Output directory for screenshots
  outputDir: './screenshots',

  // Screenshot settings
  screenshotOptions: {
    fullPage: true, // Capture full page or just viewport
    quality: 90, // JPEG quality (if using JPEG format)
  },

  // Device configurations
  devices: {
    desktop: {
      name: 'Desktop',
      viewport: { width: 1920, height: 1080 },
    },
    mobile: {
      name: 'Mobile',
      viewport: { width: 375, height: 812 }, // iPhone 12/13
    },
    tablet: {
      name: 'Tablet',
      viewport: { width: 768, height: 1024 }, // iPad
    },
  },

  // Test account credentials
  // IMPORTANT: Use test accounts, not real user data!
  credentials: {
    user: {
      email: 'testuser@example.com',
      password: 'Test123456',
    },
    seller: {
      email: 'testseller@example.com',
      password: 'Test123456',
    },
  },

  // Pages to capture
  // Format: { path: '/route', name: 'filename', requiresAuth: false|'user'|'seller', description: 'optional' }
  pages: [
    // ============================================
    // PUBLIC PAGES (No authentication required)
    // ============================================
    {
      path: '/',
      name: 'home',
      requiresAuth: false,
      description: 'Homepage with product listings',
    },
    {
      path: '/search',
      name: 'search-empty',
      requiresAuth: false,
      description: 'Empty search page',
    },
    {
      path: '/search?q=tomat',
      name: 'search-results',
      requiresAuth: false,
      description: 'Search results for "tomat"',
    },
    {
      path: '/users/login',
      name: 'user-login',
      requiresAuth: false,
      description: 'User login page',
    },
    {
      path: '/users/register',
      name: 'user-register',
      requiresAuth: false,
      description: 'User registration page',
    },
    {
      path: '/sellers/login',
      name: 'seller-login',
      requiresAuth: false,
      description: 'Seller login page',
    },
    {
      path: '/sellers/register',
      name: 'seller-register',
      requiresAuth: false,
      description: 'Seller registration page',
    },

    // ============================================
    // USER AUTHENTICATED PAGES
    // ============================================
    {
      path: '/settings',
      name: 'user-settings',
      requiresAuth: 'user',
      description: 'User settings/profile page',
    },

    // ============================================
    // SELLER AUTHENTICATED PAGES
    // ============================================
    {
      path: '/seller/dashboard',
      name: 'seller-dashboard',
      requiresAuth: 'seller',
      description: 'Seller dashboard',
    },

    // ============================================
    // ADD YOUR CUSTOM PAGES BELOW
    // ============================================
    // Examples:
    // {
    //   path: '/products/abc-123-def',
    //   name: 'product-detail',
    //   requiresAuth: false,
    //   description: 'Product detail page example',
    // },
    // {
    //   path: '/seller/products/new',
    //   name: 'seller-add-product',
    //   requiresAuth: 'seller',
    //   description: 'Add new product form',
    // },
  ],

  // Advanced settings
  advanced: {
    // Wait time after page load (milliseconds)
    pageLoadWait: 1000,

    // Wait for network to be idle before screenshot
    waitForNetworkIdle: true,

    // Headless mode (true = no visible browser, false = show browser)
    headless: true,

    // Take screenshots in parallel (faster but uses more memory)
    parallel: false,

    // Maximum parallel browsers (only used if parallel: true)
    maxParallel: 3,

    // Additional wait for specific elements (optional)
    // Example: waitForSelectors: ['.product-grid', '.navbar']
    waitForSelectors: [],

    // Scroll to bottom before screenshot (good for lazy-loaded content)
    scrollToBottom: false,

    // Hide specific elements (useful for hiding dynamic content like dates/timestamps)
    // Example: hideElements: ['.timestamp', '.live-chat']
    hideElements: [],
  },
};

export default config;
