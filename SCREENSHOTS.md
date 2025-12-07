# 📸 Automated Screenshot Capture Guide

This guide will help you automatically capture screenshots of your TaniJual app for your portfolio showcase.

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
npx playwright install chromium
```

### Step 2: Configure Your Test Accounts

Edit `scripts/screenshot-config.mjs` and update the credentials:

```javascript
credentials: {
  user: {
    email: 'your-test-user@example.com',  // ← Change this
    password: 'YourPassword123',           // ← Change this
  },
  seller: {
    email: 'your-test-seller@example.com', // ← Change this
    password: 'YourPassword123',           // ← Change this
  },
}
```

> **Important:** Use test accounts only! Don't use real user credentials.

### Step 3: Run the Screenshot Script

```bash
# Terminal 1: Start your dev server
npm run dev

# Terminal 2: Run screenshot capture
npm run screenshots
```

That's it! Your screenshots will be saved in the `screenshots/` folder.

## 📁 Output

Screenshots are saved with descriptive names:

```
screenshots/
├── home-desktop.png
├── home-mobile.png
├── home-tablet.png
├── user-login-desktop.png
├── user-login-mobile.png
├── user-settings-desktop.png
├── seller-dashboard-desktop.png
└── ... and more
```

## ⚙️ Customization

### Add More Pages

Edit `scripts/screenshot-config.mjs` and add pages to the `pages` array:

```javascript
pages: [
  // Add your custom pages here
  {
    path: '/products/some-id',
    name: 'product-detail',
    requiresAuth: false,
    description: 'Product detail page',
  },
  {
    path: '/seller/products/new',
    name: 'add-product',
    requiresAuth: 'seller',
    description: 'Add new product form',
  },
]
```

### Change Device Sizes

Modify the `devices` object in `scripts/screenshot-config.mjs`:

```javascript
devices: {
  desktop: {
    name: 'Desktop',
    viewport: { width: 1920, height: 1080 }, // Full HD
  },
  mobile: {
    name: 'Mobile',
    viewport: { width: 375, height: 812 }, // iPhone 12/13
  },
  // Add more devices:
  tablet: {
    name: 'Tablet',
    viewport: { width: 768, height: 1024 },
  },
}
```

### Screenshot Options

In `scripts/screenshot-config.mjs`, adjust screenshot settings:

```javascript
screenshotOptions: {
  fullPage: true,  // false = capture only visible viewport
  quality: 90,     // Image quality (1-100)
}
```

### Advanced Settings

```javascript
advanced: {
  pageLoadWait: 1000,           // Wait time after page load (ms)
  waitForNetworkIdle: true,     // Wait for network requests to finish
  headless: true,               // false = show browser window
  scrollToBottom: false,        // true = scroll to load lazy content
  hideElements: ['.timestamp'], // Hide dynamic content
}
```

## 🎯 Common Use Cases

### Capture Product Detail Pages

If you have specific products you want to showcase:

1. Get the product ID from your database or URL
2. Add to `pages` array in config:

```javascript
{
  path: '/products/abc-123-def-456',
  name: 'product-tomato',
  requiresAuth: false,
  description: 'Tomato product detail',
}
```

### Capture Search Results

```javascript
{
  path: '/search?q=tomat&categoryId=some-category-id',
  name: 'search-filtered',
  requiresAuth: false,
  description: 'Filtered search results',
}
```

### Capture Seller Product Management

```javascript
{
  path: '/seller/products',
  name: 'seller-products-list',
  requiresAuth: 'seller',
  description: 'Seller product management page',
}
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'playwright'"

**Solution:**
```bash
npm install -D playwright
npx playwright install chromium
```

### Issue: Login fails / Credentials incorrect

**Solution:**
1. Make sure your test accounts exist in the database
2. Verify credentials in `scripts/screenshot-config.mjs`
3. Check if login form selectors match your app
4. Set `headless: false` in config to see the browser

### Issue: Page looks broken or incomplete

**Solution:**
1. Increase `pageLoadWait` in advanced settings
2. Enable `scrollToBottom: true` for lazy-loaded content
3. Add specific selectors to `waitForSelectors`
4. Check browser console for errors (set `headless: false`)

### Issue: Screenshots are blank or white

**Solution:**
1. Make sure dev server is running on correct URL
2. Check `baseUrl` in config matches your dev server
3. Wait longer for page to load (`pageLoadWait: 2000`)

### Issue: Authentication not working

**Solution:**
1. Check if login form HTML structure matches the script
2. Update selectors in `setupAuth()` function in `capture-screenshots.mjs`
3. Verify localStorage keys match your app's auth system

## 📋 Pre-Capture Checklist

Before running the screenshot script:

- [ ] Dev server is running (`npm run dev`)
- [ ] Test accounts are created and credentials are correct
- [ ] Database has sample products/data to display
- [ ] All pages you want to capture are listed in config
- [ ] Device sizes are configured correctly
- [ ] You've tested login manually with test accounts

## 💡 Tips for Great Portfolio Screenshots

1. **Clean Data**: Use realistic but clean test data
2. **Consistent Branding**: Ensure colors and logos are correct
3. **Full Features**: Showcase products, categories, search results
4. **User Flows**: Capture registration → login → dashboard flow
5. **Mobile First**: Mobile screenshots are very important for portfolios
6. **Annotations**: After capturing, add arrows/text in image editor to highlight features

## 🎨 Post-Processing Recommendations

After capturing screenshots, you can:

1. **Add device frames** - Use tools like:
   - [Screely](https://www.screely.com/)
   - [Mockuphone](https://mockuphone.com/)
   - [Shots.so](https://shots.so/)

2. **Create comparison layouts** - Show mobile + desktop side by side

3. **Annotate features** - Use Figma, Canva, or Photoshop to add:
   - Arrows pointing to key features
   - Text descriptions
   - Feature highlights

4. **Optimize file size** - Use tools like:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)

## 📚 Example Portfolio Layout

Organize screenshots in your portfolio like this:

```
Portfolio Document:
├── 1. Landing Page
│   ├── home-desktop.png (with annotations)
│   └── home-mobile.png
├── 2. User Features
│   ├── user-register.png
│   ├── user-settings.png
│   └── search-results.png (with feature highlights)
├── 3. Seller Dashboard
│   ├── seller-dashboard-desktop.png
│   ├── seller-add-product.png
│   └── product-management.png
└── 4. Responsive Design
    └── side-by-side-comparison.png
```

## 🔗 Useful Resources

- [Playwright Documentation](https://playwright.dev/)
- [Portfolio Best Practices](https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio/)
- [Screenshot Tools Comparison](https://www.producthunt.com/topics/screenshot)

---

**Need Help?**

If you encounter issues or need to customize further:
1. Check the detailed README in `scripts/README.md`
2. Review the config file: `scripts/screenshot-config.mjs`
3. Examine the main script: `scripts/capture-screenshots.mjs`

Happy capturing! 📸✨