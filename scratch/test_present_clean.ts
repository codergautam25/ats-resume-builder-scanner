import { sanitizeAndFixResumeData } from '../src/utils/resumeSanitizer';

const sampleData: any = {
  personalInfo: { fullName: 'Indrani Ghosh' },
  experience: [
    {
      company: 'Tata Consultancy Services Limited',
      position: 'ServiceNow Developer',
      startDate: 'Jan 2024',
      endDate: 'Presen',
      highlights: ['Jan 2024 administering ServiceNow solutions. , Present.']
    }
  ]
};

const sanitized = sanitizeAndFixResumeData(sampleData);
console.log('Sanitized Job 1 EndDate:', JSON.stringify(sanitized.experience[0].endDate));
