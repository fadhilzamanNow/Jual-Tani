import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";
import config from "./screenshot-config.mjs";

const {
  baseUrl,
  outputDir,
  screenshotOptions,
  devices,
  credentials,
  pages,
  advanced,
} = config;

/**
 * Authenticate user or seller
 */
async function setupAuth(page, role) {
  if (!role) return;

  console.log(`  ↳ Authenticating as ${role}...`);

  // Navigate to login page
  const loginPath = role === "user" ? "/users/login" : "/sellers/login";
  await page.goto(`${baseUrl}${loginPath}`);
  await page.waitForLoadState("networkidle");

  // Fill in credentials
  await page.fill('input[type="email"]', credentials[role].email);
  await page.fill('input[type="password"]', credentials[role].password);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation after login
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

/**
 * Scroll to bottom of page (for lazy-loaded content)
 */
async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

/**
 * Hide specific elements before screenshot
 */
async function hideElements(page, selectors) {
  if (!selectors || selectors.length === 0) return;

  for (const selector of selectors) {
    await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      elements.forEach((el) => {
        el.style.display = "none";
      });
    }, selector);
  }
}

/**
 * Capture screenshot for a single page
 */
async function captureScreenshot(page, pageConfig, device, outputDirectory) {
  const { path, name, description } = pageConfig;
  const filename = `${name}-${device.name.toLowerCase()}.png`;
  const filepath = join(outputDirectory, filename);

  try {
    // Navigate to page
    await page.goto(`${baseUrl}${path}`, {
      waitUntil: advanced.waitForNetworkIdle ? "networkidle" : "load",
    });

    // Wait for specific selectors if configured
    if (advanced.waitForSelectors && advanced.waitForSelectors.length > 0) {
      for (const selector of advanced.waitForSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 5000 });
        } catch (e) {
          console.warn(`    ⚠ Selector not found: ${selector}`);
        }
      }
    }

    // Scroll to bottom if configured
    if (advanced.scrollToBottom) {
      await scrollToBottom(page);
      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    // Hide specific elements if configured
    if (advanced.hideElements && advanced.hideElements.length > 0) {
      await hideElements(page, advanced.hideElements);
    }

    // Wait for page to settle
    await page.waitForTimeout(advanced.pageLoadWait);

    // Take screenshot
    await page.screenshot({
      path: filepath,
      fullPage: screenshotOptions.fullPage,
    });

    console.log(`  ✓ Captured: ${filename}`);
    if (description) {
      console.log(`    └─ ${description}`);
    }
  } catch (error) {
    console.error(`  ✗ Failed to capture ${filename}:`, error.message);
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log("🚀 Starting automated screenshot capture...\n");
  console.log(`📍 Base URL: ${baseUrl}`);
  console.log(`📁 Output directory: ${outputDir}\n`);

  // Create screenshots directory
  await mkdir(outputDir, { recursive: true });

  // Launch browser
  const browser = await chromium.launch({
    headless: advanced.headless,
  });

  // Group pages by authentication requirement
  const publicPages = pages.filter((p) => !p.requiresAuth);
  const userPages = pages.filter((p) => p.requiresAuth === "user");
  const sellerPages = pages.filter((p) => p.requiresAuth === "seller");

  const totalPages = pages.length;
  const totalDevices = Object.keys(devices).length;
  const totalScreenshots = totalPages * totalDevices;

  console.log(`📊 Total pages: ${totalPages}`);
  console.log(`📱 Total devices: ${totalDevices}`);
  console.log(`📸 Total screenshots to capture: ${totalScreenshots}\n`);

  let capturedCount = 0;

  // Capture public pages (no auth needed)
  if (publicPages.length > 0) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📸 Capturing PUBLIC pages...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    for (const [deviceKey, deviceConfig] of Object.entries(devices)) {
      const context = await browser.newContext({
        viewport: deviceConfig.viewport,
      });
      const page = await context.newPage();

      console.log(
        `📱 Device: ${deviceConfig.name} (${deviceConfig.viewport.width}x${deviceConfig.viewport.height})`,
      );

      for (const pageConfig of publicPages) {
        await captureScreenshot(page, pageConfig, deviceConfig, outputDir);
        capturedCount++;
      }

      console.log("");
      await context.close();
    }
  }

  // Capture user authenticated pages
  if (userPages.length > 0) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📸 Capturing USER authenticated pages...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    for (const [deviceKey, deviceConfig] of Object.entries(devices)) {
      const context = await browser.newContext({
        viewport: deviceConfig.viewport,
      });
      const page = await context.newPage();

      console.log(
        `📱 Device: ${deviceConfig.name} (${deviceConfig.viewport.width}x${deviceConfig.viewport.height})`,
      );

      // Login as user
      await setupAuth(page, "user");

      for (const pageConfig of userPages) {
        await captureScreenshot(page, pageConfig, deviceConfig, outputDir);
        capturedCount++;
      }

      console.log("");
      await context.close();
    }
  }

  // Capture seller authenticated pages
  if (sellerPages.length > 0) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📸 Capturing SELLER authenticated pages...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    for (const [deviceKey, deviceConfig] of Object.entries(devices)) {
      const context = await browser.newContext({
        viewport: deviceConfig.viewport,
      });
      const page = await context.newPage();

      console.log(
        `📱 Device: ${deviceConfig.name} (${deviceConfig.viewport.width}x${deviceConfig.viewport.height})`,
      );

      // Login as seller
      await setupAuth(page, "seller");

      for (const pageConfig of sellerPages) {
        await captureScreenshot(page, pageConfig, deviceConfig, outputDir);
        capturedCount++;
      }

      console.log("");
      await context.close();
    }
  }

  await browser.close();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✨ Screenshot capture completed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `📊 Total screenshots captured: ${capturedCount}/${totalScreenshots}`,
  );
  console.log(`📁 Screenshots saved to: ${outputDir}\n`);
}

// Run the script
main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
