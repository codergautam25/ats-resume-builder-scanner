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
 based record creation, etc.
000041.4 000041.4• 00378.91a strong understanding of ITSM Worked extensively with UI Actions, UI Policies, Client Scripts,
00378.91processes and experience in
 Business rules, ACLs
00378.91troubleshooting various issues.
000041.4 000041.4• Built Automated Test Framework (ATF) test cases to validate
 catalog submissions, approvals, RITM creation, and field-level
00378.91 00378.91Technical Skills: validations
000041.4 000041.4• 00378.91 00378.91ServiceNow Skills Integrated Active Directory OU with ServiceNow using Import
 Sets, Transform Maps, and Transform Scripts
00396.91 00396.91• 00414.91Service Catalog Development
000041.4 000041.4• Worked on Inbound email action, Workflows, Scheduled data
00396.91 00396.91• 00414.91Flow Designer
00396.91 00396.91• 00414.91Automated Test Framework exports
000041.4 000041.4• 00414.91(ATF) Conducted testing and validation to ensure solution quality and
00396.91 00396.91• 00414.91UI Policies, UI Actions, Client reliability.
000041.4 000041.4• 00414.91Scripts, Business Rules, ACLs, Collaborated with senior developers and stakeholders to analyze
00414.91etc. requirements and deliver custom solutions
00396.91 00396.91• 00414.91JavaScript (ServiceNow
000041.4 000041.4ServiceNow Administrator
00414.91scripting)
000041.4 000041.4Tata Consultancy Service Limited 00194.09, 00202.13Kolkata
00396.91 00396.91• 00414.91Glide APIs
000041.4 000041.4Nov 2020 00378.91 00378.91Tools & Practices , Dec 2023
000041.4 000041.4• 00396.91 00396.91• 00414.91ITSM Modules Managed ServiceNow instances including upgrades, patches, and
00396.91 00396.91• 00414.91Agile / Scrum (basic exposure) cloning activities.
000041.4 000041.4• 00378.91 00378.91Soft Skills Led a team of administrators ensuring system stability and
00396.91 00396.91• 00414.91Stakeholder Communication performance.
000041.4 000041.4• 00396.91 00396.91• 00414.91Analytical Thinking Raised Hi-portal cases and coordinated with ServiceNow support
00396.91 00396.91• 00414.91Team Leadership to resolve OOB defects
000041.4 000041.4• 00396.91 00396.91• 00414.91Problem Solving Configured users, roles, and access controls across the platform.
000041.4 000041.4• Provided end-user support, resolved incidents, and improved
 user experience.
00378.91 00378.91Certification:
000041.4 000041.4• Handled change deployment, created reports & scheduled email
00378.91 00378.91 00396.91ServiceNow Certified System
 reports, Creation of Business Services, configured SLAs.
00396.91Administrator
000041.4 000041.4• Creation and modification of ServiceNow notifications.
00378.91 00378.91Achievements:
000041.4 000041.4Education:
00378.91 00378.91 00396.91Received highest performance band
000041.4 000041.4Master of Computer Applications (MCA), 2021 00250.85, 
00396.91on 2024 and 2026
000041.4 000041.4Chandigarh University (Distance learning), Punjab
00378.91 00378.91 00396.91Service Excellence Award 2023
00396.91received as a ServiceNow
000041.4 000041.4Bachelor of Computer Applications (BCA), 2017 00254.93, 
00396.91Administrator
000041.4 000041.4Maulana Abul Kalam Azad University of Technology, West Bengal
http://www.linkedin.com/in/indrani-ghosh-9b2b2a1aa
mailto:indranighosh1409@gmail.com`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.fill('textarea[placeholder*="Paste your existing resume text"]', rawIndraniText);
  await page.waitForTimeout(1000);

  const screenshotPath = path.join(process.cwd(), 'scratch', 'indrani_ui_proof.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  console.log('Indrani UI proof screenshot saved to:', screenshotPath);
  await browser.close();
}

main().catch(console.error);
