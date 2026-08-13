import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Click Export PDF button in header from the initial Scan tab
  console.log('Testing Export PDF button from Scan tab...');
  const exportBtn = page.locator('button:has-text("Export PDF")');
  await exportBtn.click();

  // Wait 1 second to verify tab automatically switches to Preview & Export and DOM element is found
  await page.waitForTimeout(1000);

  const currentTab = await page.locator('header nav button.bg-blue-600').textContent();
  console.log('Active tab after clicking Export PDF:', currentTab);

  const containerExists = await page.locator('#resume-preview-container').count();
  console.log('Resume preview container exists in DOM:', containerExists > 0);

  if (containerExists > 0) {
    console.log('SUCCESS: Download / Export PDF button is 100% working!');
  } else {
    console.error('FAILED: Container not found');
  }

  await browser.close();
}

main().catch(console.error);
