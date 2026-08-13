const sampleJunk = `%
x}],7r{z67 , 4<+?@k\`! D &3u붮3cxnGV&\`0 0Hޭ+ۆ3 {巷m7 ?fCnnnotO
O F?? l8sT \`6K Ƨ 7o? Jv soosw}3b* {bx r}fB I' krԾS c'ܽ+AJe7 )# ~' ',⢃7X5/PKpo'&xw /{։a 3%Kw7 ťp-ܣO ::d6 cB:sqh/o1<نo j \\ : r17gY,ymkJҷsK^( 5H$Y\`ި & [Sq w7vx ]r T#j3Jt ɵ X dƢ\\v O- Ѥ* Z"F\` ~ d[2 2 ی"u 2 =ӻ JV'vSmS&G@IuP_[ozh/~^@ Ba \`\`k 8Zd=~nKj-+ (ۺ[V0*BTOKo 1ݴ
pho% [m({(.j i49 ]3+ 72."ˌaqs!`;

function isReadableText(text) {
  if (!text || text.trim().length < 30) return false;

  const sample = text.slice(0, 3000);

  // 1. Reject if PDF binary syntax / dictionary keys present
  if (/%PDF-|endobj|endstream|startxref|\/Filter|\/Length\s+\d|\/Annots|\/StructParents|\/DW\s+0|\/Contents/i.test(sample)) return false;

  // 2. Reject font width bracket arrays or xref tables
  if (/\[\d{2,}\.?\d*\s+\d+.*?\d{2,}\.?\d*\]/.test(sample) || /\b00000\d{5}\s+00000\s+n\b/.test(sample)) return false;

  // 3. Count non-standard ASCII/Latin printable characters (e.g. CJK, random Unicode symbols, high-byte font mojibake)
  const latinAndPunctuation = sample.replace(/[^\x09\x0A\x0D\x20-\x7E\u00C0-\u024F]/g, '');
  const nonLatinGarbageRatio = (sample.length - latinAndPunctuation.length) / sample.length;

  console.log('Non-Latin Garbage Ratio:', nonLatinGarbageRatio);
  if (nonLatinGarbageRatio > 0.03) return false; // >3% non-Latin/extended Unicode is font mojibake

  // 4. Word validity check: count English dictionary / valid resume words vs total word tokens
  const wordTokens = sample.match(/\b[a-zA-Z]{2,}\b/g) || [];
  if (wordTokens.length < 10) return false;

  // Must contain AT LEAST 2 standard resume structural keywords
  const resumeKeywords = [
    'experience', 'education', 'skills', 'summary', 'projects', 'work', 'university',
    'college', 'engineer', 'developer', 'analyst', 'manager', 'specialist', 'lead',
    'certified', 'contact', 'email', 'phone', 'technologies', 'certifications', 'profile'
  ];
  const lowerSample = sample.toLowerCase();
  const matchedKeywords = resumeKeywords.filter((kw) => lowerSample.includes(kw));
  console.log('Matched keywords:', matchedKeywords);

  if (matchedKeywords.length < 2) return false;

  return true;
}

console.log('isReadable Result:', isReadableText(sampleJunk));
