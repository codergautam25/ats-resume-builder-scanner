import { execFileSync } from 'child_process';
import path from 'path';

const pdfPath = '/Users/gautam/.gemini/antigravity/brain/e95c53bb-cc8e-4846-bc73-fd7a0120fa7f/.user_uploaded/media_1786345908910.pdf';

try {
  const scriptPath = path.join(process.cwd(), 'scripts', 'pdf_parser.py');
  const output = execFileSync('python3', [scriptPath, pdfPath], { encoding: 'utf8' });
  const parsed = JSON.parse(output);
  console.log('Python Parser Exec Result:');
  console.log('Success:', parsed.success);
  console.log('Method:', parsed.method);
  console.log('Pages:', parsed.pages_count);
  console.log('Extracted text preview:', parsed.text.slice(0, 300));
} catch (e: any) {
  console.error('Error executing python script:', e.message);
}
