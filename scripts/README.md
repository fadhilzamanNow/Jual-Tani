# Automated Screenshot Capture

This script automatically captures screenshots of your TaniJual app in multiple device sizes (Desktop, Mobile, Tablet) for portfolio showcase.

## Prerequisites

1. **Install Playwright**
   ```bash
   npm install -D playwright
   ```

2. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

## Configuration

Edit `capture-screenshots.mjs` to configure:

### 1. Base URL
```javascript
const BASE_URL = 'http://localhost:3000'; // Your dev server URL
```

### 2. Test Credentials
Update the credentials section with your test accounts:
```javascript
const credentials = {
  user: {
    email: 'user@example.com',    // Your test user email
    password: 'password123',       // Your test user password
  },
  seller: {
    email: 'seller@example.com',   // Your test seller email
    password: 'password123',       // Your test seller password
  },
};
```

### 3. Pages to Capture
Add or remove pages in the `pages` array:
```javascript
const pages = [
  { path: '/', name: 'home', requiresAuth: false },
  { path: '/users/login', name: 'user-login', requiresAuth: false },
  { path: '/settings', name: 'user-settings', requiresAuth: 'user' },
  { path: '/seller/dashboard', name: 'seller-dashboard', requiresAuth: 'seller' },
  // Add more pages here...
];
```

### 4. Device Sizes
Modify viewport sizes in the `devices` object:
```javascript
const devices = {
  desktop: { viewport: { width: 1920, height: 1080 } },
  mobile: { viewport: { width: 375, height: 812 } },
  tablet: { viewport: { width: 768, height: 1024 } },
};
```

## Usage

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **In a new terminal, run the screenshot script**
   ```bash
   node scripts/capture-screenshots.mjs
   ```

3. **Find your screenshots**
   Screenshots will be saved in the `screenshots/` directory with names like:
   - `home-desktop.png`
   - `home-mobile.png`
   - `user-settings-tablet.png`
   - etc.

## Add to package.json (Optional)

Add this to your `scripts` section in `package.json`:
```json
{
  "scripts": {
    "screenshots": "node scripts/capture-screenshots.mjs"
  }
}
```

Then run:
```bash
npm run screenshots
```

## Tips

- **Full Page Screenshots**: The script captures full page scrolling screenshots
- **Network Idle**: Waits for network requests to finish before capturing
- **Authentication**: Automatically logs in for protected pages
- **Organized Output**: All screenshots saved in one folder with clear naming

## Troubleshooting

### Script hangs or times out
- Increase `waitForTimeout` values in the script
- Check if your dev server is running
- Verify credentials are correct

### Pages look broken
- Ensure all images and assets are loading
- Check console for errors: Remove `headless: true` in `chromium.launch()`
- Clear browser cache/storage

### Missing content
- Increase wait time after page load
- Add custom wait conditions for specific elements

## Example Output

```
🚀 Starting automated screenshot capture...

📸 Capturing public pages...

  📱 Device: Desktop
  ✓ Captured: home-desktop.png
  ✓ Captured: user-login-desktop.png
  ✓ Captured: user-register-desktop.png

  📱 Device: Mobile
  ✓ Captured: home-mobile.png
  ✓ Captured: user-login-mobile.png
  ✓ Captured: user-register-mobile.png

📸 Capturing user authenticated pages...
  ↳ Authenticating as user...
  
  📱 Device: Desktop
  ✓ Captured: user-settings-desktop.png

✨ Screenshot capture completed!
📁 Screenshots saved to: ./screenshots
```

## Advanced Customization

### Capture specific product pages
```javascript
{ path: '/products/123e4567-e89b-12d3-a456-426614174000', name: 'product-detail', requiresAuth: false }
```

### Capture with search query
```javascript
{ path: '/search?q=tomat', name: 'search-tomat', requiresAuth: false }
```

### Add custom wait conditions
```javascript
// Wait for specific element
await page.waitForSelector('.product-grid');

// Wait for specific text
await page.waitForFunction(() => document.body.innerText.includes('TaniJual'));
```

### Capture only visible viewport (not full page)
```javascript
await page.screenshot({
  path: filepath,
  fullPage: false, // Change to false
});
```
