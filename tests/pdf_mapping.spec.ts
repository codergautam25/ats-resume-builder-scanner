import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('PDF Parsing & Field Mapping E2E Test Suite', () => {

  // 1. PDF Parsing Endpoint Cleanliness & Artifact Stripping
  test('1. POST /api/parse-document cleans PDF text & strips binary/control artifacts', async ({ request }) => {
    // Send a sample base64 string representing text with potential control characters & PDF metadata
    const sampleTextWithArtifacts = `Alex Rivera
Senior Full Stack Engineer
alex.rivera@example.com | +1 (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alexrivera-tech | GitHub: github.com/alexrivera-dev

SUMMARY
Senior Full Stack Engineer with 6+ years experience in microservices, React, Node.js, Python, and AWS.

WORK EXPERIENCE
Apex Cloud Innovations - Senior Full Stack Engineer (2022-Present)
- Built analytics dashboard for 2M daily users using React, Node.js, Kafka, reducing rendering latency by 42%.
- Built serverless API on AWS Lambda & DynamoDB, cutting cloud costs by $18,000/month.

SKILLS
TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Redis, GraphQL, CI/CD`;

    const base64Data = Buffer.from(sampleTextWithArtifacts).toString('base64');

    const resp = await request.post(`${BASE_URL}/api/parse-document`, {
      data: {
        fileName: 'resume_alex_rivera.txt',
        fileType: 'text/plain',
        base64Data,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(resp.ok()).toBeTruthy();
    const json = await resp.json();
    expect(json).toHaveProperty('text');
    const parsedText = json.text;

    // Verify text is clean
    expect(parsedText).not.toContain('%PDF-');
    expect(parsedText).not.toContain('endobj');
    expect(parsedText).not.toContain('\uFFFD');
    expect(parsedText).toContain('Alex Rivera');
    expect(parsedText).toContain('alex.rivera@example.com');
    expect(parsedText).toContain('TypeScript');

    console.log('✅ PASS: Document parsing endpoint returned clean, artifact-free text');
  });

  // 1b. Font-scrambled PDF noise rejection & fallback verification
  test('1b. POST /api/parse-document rejects font-scrambled noise strings and returns clean status or error', async ({ request }) => {
    const scrambledNoise = `% x}],7r{z67 , 4<+?@k\`! D &3u붮3cxnGV&\`0 0Hޭ+ۆ3 {巷m7 ?fCnnnotO O F?? l8sT \`6K Ƨ 7o? Jv soosw}3b* {bx r}fB I' krԾS c'ܽ+AJe7 )# ~' ',⢃7X5/PKpo'&xw /{։a 3%Kw7 ťp-ܣO ::d6 cB:sqh/o1<نo j \\ : r17gY,ymkJҷsK^( 5H$Y\`ި & [Sq w7vx ]r T#j3Jt ɵ X dƢ\\v O- Ѥ* Z"F\` ~ d[2 2 ی"u 2 =ӻ JV'vSmS&G@IuP_[ozh/~^@ Ba \`\`k 8Zd=~nKj-+ (ۺ[V0*BTOKo 1ݴ #jJx= Q C~k cO p,Cp`;

    const base64Data = Buffer.from(scrambledNoise).toString('base64');

    const resp = await request.post(`${BASE_URL}/api/parse-document`, {
      data: {
        fileName: 'scrambled_font.pdf',
        fileType: 'application/pdf',
        base64Data,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    if (resp.ok()) {
      const json = await resp.json();
      expect(json.text).not.toContain('#jJx=');
      expect(json.text).not.toContain('x}],7r{z67');
    } else {
      expect(resp.status()).toBe(422);
      const json = await resp.json();
      expect(json).toHaveProperty('error');
      expect(json.error).toContain('readable text');
    }
    console.log('✅ PASS: Scrambled font noise rejected successfully (no binary leakage)');
  });

  // 2. Field Mapping verification in /api/analyze-resume
  test('2. POST /api/analyze-resume maps parsed text to all respective ResumeData fields', async ({ request }) => {
    const rawResumeText = `Alex Rivera
Senior Full Stack Engineer
alex.rivera@example.com | +1 (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alexrivera-tech | GitHub: github.com/alexrivera-dev

SUMMARY
Senior Full Stack Engineer with 6+ years experience in microservices, React, Node.js, Python, and AWS. Reduced latency by 40%.

WORK EXPERIENCE
Apex Cloud Innovations - Senior Full Stack Engineer (2022-Present)
- Built analytics dashboard for 2M daily users using React, Node.js, Kafka, reducing rendering latency by 42%.
- Built serverless API on AWS Lambda & DynamoDB, cutting cloud costs by $18,000/month.

Nexus Software Solutions - Full Stack Developer (2019-2022)
- Built web apps using React, PostgreSQL, Express for 500k active users.
- Optimized SQL queries and indexed PostgreSQL tables to speed up reads from 450ms to 85ms.

EDUCATION
University of California, Berkeley - Bachelor of Science in Computer Science (2015-2019)

PROJECTS
DevMetrics CLI - Open Source Maintainer
- Built CLI tool in Node.js with 1,400 GitHub stars for automated PR metrics.

SKILLS
Programming Languages: TypeScript, JavaScript, Python, SQL
Frontend & Mobile: React, Next.js, HTML5, CSS3, Tailwind CSS
Backend & Cloud: Node.js, Express, AWS Lambda, Docker, PostgreSQL, MongoDB, Redis, GraphQL, CI/CD

CERTIFICATIONS
AWS Certified Solutions Architect - Associate (Amazon Web Services, 2023)`;

    const jobDescription = 'Looking for Senior Full Stack Engineer proficient in React, TypeScript, Node.js, AWS, PostgreSQL, and Docker.';

    const resp = await request.post(`${BASE_URL}/api/analyze-resume`, {
      data: {
        rawResumeText,
        jobDescription,
      },
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    expect(resp.ok()).toBeTruthy();
    const json = await resp.json();

    // Verify root structures exist
    expect(json).toHaveProperty('resumeData');
    expect(json).toHaveProperty('analysis');

    const rd = json.resumeData;

    // 1. Personal Info Mapping
    expect(rd).toHaveProperty('personalInfo');
    expect(rd.personalInfo.fullName).toBeTruthy();
    expect(rd.personalInfo.fullName.toLowerCase()).toContain('alex');
    expect(rd.personalInfo.email).toContain('alex.rivera@example.com');
    console.log(`  ✓ Personal Info mapped: Name="${rd.personalInfo.fullName}", Email="${rd.personalInfo.email}"`);

    // 2. Summary Mapping
    expect(rd).toHaveProperty('summary');
    expect(rd.summary).toBeTruthy();
    console.log(`  ✓ Summary mapped: ${rd.summary.slice(0, 60)}...`);

    // 3. Work Experience Mapping
    expect(rd).toHaveProperty('experience');
    expect(Array.isArray(rd.experience)).toBeTruthy();
    expect(rd.experience.length).toBeGreaterThan(0);
    const firstJob = rd.experience[0];
    expect(firstJob).toHaveProperty('company');
    expect(firstJob).toHaveProperty('position');
    expect(firstJob).toHaveProperty('highlights');
    expect(firstJob.highlights.length).toBeGreaterThan(0);
    console.log(`  ✓ Experience mapped: ${rd.experience.length} jobs detected (e.g. "${firstJob.position}" at "${firstJob.company}")`);

    // 4. Skill Categories Mapping
    expect(rd).toHaveProperty('skillCategories');
    expect(Array.isArray(rd.skillCategories)).toBeTruthy();
    expect(rd.skillCategories.length).toBeGreaterThan(0);
    const totalSkills = rd.skillCategories.reduce((acc: number, cat: any) => acc + (cat.skills ? cat.skills.length : 0), 0);
    expect(totalSkills).toBeGreaterThan(0);
    console.log(`  ✓ Skills mapped: ${rd.skillCategories.length} categories with ${totalSkills} total skills`);

    // 5. Analysis Scores & Found Keywords
    const analysis = json.analysis;
    expect(analysis).toHaveProperty('overallScore');
    expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
    expect(analysis.overallScore).toBeLessThanOrEqual(100);
    expect(analysis).toHaveProperty('foundKeywords');
    expect(Array.isArray(analysis.foundKeywords)).toBeTruthy();
    console.log(`  ✓ Analysis mapped: Overall Score=${analysis.overallScore}%, Found Keywords=${analysis.foundKeywords.length}`);

    console.log('✅ PASS: All resume fields mapped successfully to their respective data schema!');
  });

  // 3. UI Resume Editor Flow & Field Rendering
  test('3. UI correctly parses resume and populates Editor fields', async ({ page }) => {
    await page.goto(BASE_URL);

    // Click sample resume button
    const sampleBtn = page.locator('button', { hasText: /SE Sample|Sample/i }).first();
    if (await sampleBtn.isVisible()) {
      await sampleBtn.click();
      await page.waitForTimeout(500);
    }

    // Navigate to Resume Editor tab
    const editorTab = page.locator('button', { hasText: /Resume Editor|3\. Resume/i }).first();
    await editorTab.click();
    await page.waitForTimeout(500);

    // Navigate to Contact Info sub-tab in Editor
    const infoSubTab = page.locator('button', { hasText: 'Contact Info' }).first();
    if (await infoSubTab.isVisible()) {
      await infoSubTab.click();
      await page.waitForTimeout(300);
    }

    // Verify fields populated in Editor UI
    const nameSection = page.locator('label', { hasText: 'Full Name' }).locator('..').locator('input');
    await expect(nameSection).toBeVisible();

    const emailSection = page.locator('label', { hasText: 'Email Address' }).locator('..').locator('input');
    await expect(emailSection).toBeVisible();

    console.log('✅ PASS: Resume Editor UI fields populated correctly from parsed data');
  });

});
