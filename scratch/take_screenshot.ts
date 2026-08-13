import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Click sample resume button
  const sampleBtn = page.locator('button', { hasText: /SE Sample|Sample/i }).first();
  if (await sampleBtn.isVisible()) {
    await sampleBtn.click();
    await page.waitForTimeout(1000);
  }

  // Take screenshot of Editor & Preview
  const screenshotPath = path.join(process.cwd(), 'scratch', 'clean_resume_preview.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  console.log('Screenshot saved to:', screenshotPath);
  await browser.close();
})();
