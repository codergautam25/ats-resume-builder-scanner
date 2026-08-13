import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Click Career Roadmap button
  await page.click('button:has-text("Career Roadmap")');
  await page.waitForTimeout(1000);

  // Scroll to ServiceNow Career Roles & Hands-On Projects Advisor section
  const advisorSection = page.locator('text=ServiceNow Career Roles & Hands-On Projects Advisor');
  await advisorSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'proof_servicenow_advisor_tab.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  console.log('Saved ServiceNow Advisor proof screenshot to:', screenshotPath);
  await browser.close();
}

main().catch(console.error);
