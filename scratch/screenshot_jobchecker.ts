import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.click('button:has-text("JobChecker")');
  await page.waitForTimeout(1000);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'jobchecker_tab_preview.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  console.log('JobChecker preview screenshot saved to:', screenshotPath);
  await browser.close();
}

main().catch(console.error);
