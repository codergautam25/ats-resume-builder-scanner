import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Navigate to Resume Editor tab
  await page.click('button:has-text("3. Resume Editor")');
  await page.waitForTimeout(1000);

  // Take screenshot of Target Job Role & Ollama LLM card
  const targetCardPath = path.join(process.cwd(), 'scratch', 'proof_target_job_ollama.png');
  await page.screenshot({ path: targetCardPath, fullPage: false });
  console.log('Saved target card screenshot:', targetCardPath);

  // Click Side Projects tab
  await page.click('button:has-text("Side Projects & Accomplishments")');
  await page.waitForTimeout(800);

  const sideProjectsPath = path.join(process.cwd(), 'scratch', 'proof_side_projects_tab.png');
  await page.screenshot({ path: sideProjectsPath, fullPage: false });
  console.log('Saved side projects tab screenshot:', sideProjectsPath);

  await browser.close();
}

main().catch(console.error);
