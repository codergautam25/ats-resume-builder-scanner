import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(elementId: string, filename: string = 'ATS_Optimized_Resume.pdf'): Promise<boolean> {
  // Retry loop for element DOM mounting
  let element: HTMLElement | null = null;
  for (let i = 0; i < 10; i++) {
    element = document.getElementById(elementId);
    if (element) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!element) {
    element = document.querySelector('.resume-preview-container') || document.querySelector('[id*="resume-preview"]');
  }

  if (!element) {
    console.error(`Element with id "${elementId}" not found in DOM after retries.`);
    return false;
  }

  try {
    // Wait for fonts to finish loading if browser supports document.fonts
    if ('fonts' in document) {
      await (document as any).fonts.ready;
    }

    // Save original styling
    const originalShadow = element.style.boxShadow;
    element.style.boxShadow = 'none';

    // Render canvas with high scale for vector-like sharp text
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    element.style.boxShadow = originalShadow;

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas rendering produced 0 width or height.');
    }

    const imgData = canvas.toDataURL('image/png');

    // Standard US Letter dimensions in mm
    const imgWidth = 215.9; // 8.5 inches
    const pageHeight = 279.4; // 11 inches
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('PDF generation failed:', err);
    return false;
  }
}

export function triggerPrintResume() {
  window.print();
}
