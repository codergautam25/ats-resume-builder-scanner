import { SocialLink } from '../types';

export function isKnownSocialOrEmailDomain(urlStr: string): boolean {
  if (!urlStr) return true;
  const lower = urlStr.toLowerCase();
  return (
    lower.includes('linkedin.') ||
    lower.includes('github.') ||
    lower.includes('leetcode.') ||
    lower.includes('hackerrank.') ||
    lower.includes('scaler.') ||
    lower.includes('codechef.') ||
    lower.includes('codeforces.') ||
    lower.includes('kaggle.') ||
    lower.includes('gmail.') ||
    lower.includes('yahoo.') ||
    lower.includes('hotmail.') ||
    lower.includes('outlook.') ||
    lower.includes('icloud.') ||
    lower.includes('protonmail.') ||
    lower.includes('zoho.') ||
    lower.includes('example.')
  );
}

/**
 * Extracts and normalizes all profile/social links from text or resume data objects.
 * Supports LinkedIn, GitHub, LeetCode, HackerRank, Scaler, CodeChef, Codeforces,
 * Kaggle, Medium, Dev.to, Twitter/X, and custom portfolio websites.
 */
export function extractAllSocialLinks(text: string = '', currentInfo: any = {}): SocialLink[] {
  const links: SocialLink[] = [];
  const addedUrls = new Set<string>();

  const addLink = (label: string, rawUrl: string) => {
    if (!rawUrl) return;
    let cleanUrl = rawUrl.trim().replace(/[\s,;.)\]]+$/, '');
    if (!cleanUrl) return;

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl.replace(/^www\./, '')}`;
    }

    const key = cleanUrl.toLowerCase().replace(/\/$/, '');
    if (!addedUrls.has(key)) {
      addedUrls.add(key);
      links.push({ label, url: cleanUrl });
    }
  };

  const combinedText = `${text} ${JSON.stringify(currentInfo)}`;

  // 1. LinkedIn
  let liUrl = currentInfo.linkedin || '';
  if (!liUrl) {
    const liMatch = combinedText.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?linkedin\.com\/(?:in|pub|profile|[a-zA-Z0-9_-]+)\/[a-zA-Z0-9_.-]+\/?/i)
      || combinedText.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?linkedin\.com\/[a-zA-Z0-9_.-]+\/?/i)
      || combinedText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s,;()<>]+/i);
    if (liMatch) {
      liUrl = liMatch[0];
    } else {
      const liTextMatch = combinedText.match(/linkedin\s*[:\-\/|]\s*([a-zA-Z0-9_.-]+)/i)
        || combinedText.match(/\b(?:in|profile)\/([a-zA-Z0-9_.-]{3,50})\b/i);
      if (liTextMatch && liTextMatch[1] && !['com', 'http', 'https', 'in', 'profile'].includes(liTextMatch[1].toLowerCase())) {
        liUrl = `https://linkedin.com/in/${liTextMatch[1]}`;
      }
    }
  }
  if (liUrl) addLink('Linkedin', liUrl);

  // 2. GitHub
  let ghUrl = currentInfo.github || '';
  if (!ghUrl) {
    const ghMatch = combinedText.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?github\.com\/[a-zA-Z0-9_.-]+\/?/i)
      || combinedText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s,;()<>]+/i);
    if (ghMatch) {
      ghUrl = ghMatch[0];
    } else {
      const ghTextMatch = combinedText.match(/github\s*[:\-\/|]\s*([a-zA-Z0-9_.-]+)/i);
      if (ghTextMatch && ghTextMatch[1] && !['com', 'http', 'https'].includes(ghTextMatch[1].toLowerCase())) {
        ghUrl = `https://github.com/${ghTextMatch[1]}`;
      }
    }
  }
  if (ghUrl) addLink('Github', ghUrl);

  const isValidUsername = (user: string): boolean => {
    if (!user || typeof user !== 'string') return false;
    const clean = user.trim().toLowerCase();
    if (clean.length < 2 || /^\d+$/.test(clean) || /\d+\.\d+/.test(clean)) return false;
    return !['com', 'http', 'https', 'www', 'profile', 'users', 'u', 'academy', 'mentee'].includes(clean);
  };

  // 3. LeetCode
  let lcUrl = currentInfo.leetcode || '';
  if (!lcUrl) {
    const lcMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u|profile|users)\/([a-zA-Z0-9_.-]+)\/?/i);
    if (lcMatch && isValidUsername(lcMatch[1])) {
      lcUrl = lcMatch[0];
    } else {
      const lcTextMatch = combinedText.match(/leetcode\s*[:\-\/]\s*([a-zA-Z0-9_.-]+)/i);
      if (lcTextMatch && isValidUsername(lcTextMatch[1])) {
        lcUrl = `https://leetcode.com/u/${lcTextMatch[1]}`;
      }
    }
  }
  if (lcUrl && isValidUsername(lcUrl.split('/').pop() || '')) addLink('Leetcode', lcUrl);

  // 4. HackerRank
  let hrUrl = currentInfo.hackerrank || '';
  if (!hrUrl) {
    const hrMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?hackerrank\.com\/(?:profile\/)?([a-zA-Z0-9_.-]+)\/?/i);
    if (hrMatch && isValidUsername(hrMatch[1])) {
      hrUrl = hrMatch[0];
    } else {
      const hrTextMatch = combinedText.match(/hackerrank\s*[:\-\/]\s*([a-zA-Z0-9_.-]+)/i);
      if (hrTextMatch && isValidUsername(hrTextMatch[1])) {
        hrUrl = `https://hackerrank.com/${hrTextMatch[1]}`;
      }
    }
  }
  if (hrUrl && isValidUsername(hrUrl.split('/').pop() || '')) addLink('Hackerrank', hrUrl);

  // 5. Scaler
  let scUrl = currentInfo.scaler || '';
  if (!scUrl) {
    const scMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?scaler\.com\/academy\/profile\/([a-zA-Z0-9_.-]+)\/?/i);
    if (scMatch && isValidUsername(scMatch[1])) {
      scUrl = scMatch[0];
    } else {
      const scTextMatch = combinedText.match(/scaler\s*[:\-\/]\s*([a-zA-Z0-9_.-]+)/i);
      if (scTextMatch && isValidUsername(scTextMatch[1])) {
        scUrl = `https://scaler.com/academy/profile/${scTextMatch[1]}`;
      }
    }
  }
  if (scUrl && isValidUsername(scUrl.split('/').pop() || '')) addLink('Scaler', scUrl);

  // 6. CodeChef
  const ccMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?codechef\.com\/(?:users\/)?[a-zA-Z0-9_.-]+\/?/i);
  if (ccMatch) addLink('Codechef', ccMatch[0]);

  // 7. Codeforces
  const cfMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?codeforces\.com\/(?:profile\/)?[a-zA-Z0-9_.-]+\/?/i);
  if (cfMatch) addLink('Codeforces', cfMatch[0]);

  // 8. Kaggle
  const kgMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?kaggle\.com\/[a-zA-Z0-9_.-]+\/?/i);
  if (kgMatch) addLink('Kaggle', kgMatch[0]);

  // 9. Medium
  const medMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?medium\.com\/@[a-zA-Z0-9_.-]+\/?/i);
  if (medMatch) addLink('Medium', medMatch[0]);

  // 10. Dev.to
  const devToMatch = combinedText.match(/(?:https?:\/\/)?dev\.to\/[a-zA-Z0-9_.-]+\/?/i);
  if (devToMatch) addLink('Dev.to', devToMatch[0]);

  // 11. Twitter / X
  const xMatch = combinedText.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9_.-]+\/?/i);
  if (xMatch) addLink('Twitter', xMatch[0]);

  // 12. Portfolio or General Website (STRICT FILTER)
  let pfUrl = currentInfo.portfolio || '';
  if (pfUrl && !isKnownSocialOrEmailDomain(pfUrl)) {
    addLink('Portfolio', pfUrl);
  } else {
    pfUrl = '';
    const allUrls = combinedText.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|io|com|org|net|me|co|app|tech|site|xyz)(?:\/[^\s,;"]*)?/gi) || [];
    for (const u of allUrls) {
      if (!isKnownSocialOrEmailDomain(u)) {
        addLink('Portfolio', u);
        pfUrl = u;
        break;
      }
    }
  }

  // Preserve any customLinks provided if valid
  if (currentInfo.customLinks && Array.isArray(currentInfo.customLinks)) {
    for (const item of currentInfo.customLinks) {
      if (item.label && item.url) {
        if (item.label.toLowerCase() === 'portfolio' && isKnownSocialOrEmailDomain(item.url)) {
          continue;
        }
        addLink(item.label, item.url);
      }
    }
  }

  return links;
}

export function enrichPersonalInfoWithSocialLinks(info: any = {}, rawText: string = ''): any {
  const clone = { ...info };
  const allLinks = extractAllSocialLinks(rawText, clone);

  allLinks.forEach((link) => {
    const labelLower = link.label.toLowerCase();
    if (labelLower === 'linkedin' && !clone.linkedin) clone.linkedin = link.url;
    if (labelLower === 'github' && !clone.github) clone.github = link.url;
    if (labelLower === 'leetcode' && !clone.leetcode) clone.leetcode = link.url;
    if (labelLower === 'hackerrank' && !clone.hackerrank) clone.hackerrank = link.url;
    if (labelLower === 'scaler' && !clone.scaler) clone.scaler = link.url;
    if (labelLower === 'portfolio' && !clone.portfolio && !isKnownSocialOrEmailDomain(link.url)) {
      clone.portfolio = link.url;
    }
  });

  if (clone.portfolio && isKnownSocialOrEmailDomain(clone.portfolio)) {
    clone.portfolio = '';
  }

  clone.customLinks = allLinks;
  return clone;
}

/**
 * Dynamic RegEx Link Filtering: Hides irrelevant links based on target role.
 * e.g., Hides LeetCode for ServiceNow/PM/Design roles, highlights GitHub for Backend/AI.
 */
export function filterSocialLinksByRole(links: SocialLink[], targetRole: string = ''): SocialLink[] {
  if (!links || links.length === 0) return [];
  const roleLower = targetRole.toLowerCase();
  const isServiceNow = roleLower.includes('servicenow') || roleLower.includes('itsm');
  const isProductOrDesign = roleLower.includes('product') || roleLower.includes('design') || roleLower.includes('ux');

  return links.filter((link) => {
    const labelLower = link.label.toLowerCase();
    // Hide LeetCode & Competitive Coding links for ServiceNow, PM, and Design roles
    if ((isServiceNow || isProductOrDesign) && (labelLower.includes('leetcode') || labelLower.includes('codeforces') || labelLower.includes('codechef'))) {
      return false;
    }
    return true;
  });
}
