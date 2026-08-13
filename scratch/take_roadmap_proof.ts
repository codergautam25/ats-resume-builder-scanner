import { chromium } from 'playwright';
import path from 'path';

const rawIndraniText = `00043.44 00043.44Indrani Ghosh 00364.15 00364.15Email: 00394.87indranighosh1409@gmail.com
00364.15 00364.15Phone: +91 7407780177
00043.44 00043.44ServiceNow Developer
00364.15 00364.15Location: Kolkata, India
00043.44 00043.44www.linkedin.com/in/indrani-ghosh-9b2b2a1aa
000041.4Experience: 00378.91 00378.91Summary:
000041.4 000041.4ServiceNow Developer 00378.91 00378.91ServiceNow Developer with 5 years of
00378.91experience in designing, developing, and
000041.4 000041.4Tata Consultancy Services Limited 00198.53, 00206.57Kolkata
000041.4 000041.4Jan 2024 00378.91administering ServiceNow solutions. , Present
000041.4 000041.4• 00378.91Skilled in Flow Designer, ATF, Service Developed and configured Service Catalog solutions
00378.91Catalog development, and platform
000041.4 000041.4• Worked on flow designer for Service Catalog flow, schedule-
00378.91customization. My background includes
 based record creation, etc.`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.fill('textarea[placeholder*="Paste your existing resume text"]', rawIndraniText);
  await page.waitForTimeout(1000);

  await page.click('button:has-text("Career Roadmap")');
  await page.waitForTimeout(1000);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'roadmap_proof.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  console.log('Career Roadmap proof screenshot saved to:', screenshotPath);
  await browser.close();
}

main().catch(console.error);
