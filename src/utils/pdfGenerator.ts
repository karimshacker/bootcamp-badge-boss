
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Personnel } from '@/types/personnel';

export const generatePDF = async (element: HTMLElement, person: Personnel): Promise<void> => {
  try {
    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // Calculate dimensions for PDF (credit card size: 85.6mm × 53.98mm)
    const imgWidth = 85.6;
    const imgHeight = 53.98;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [imgWidth, imgHeight],
    });

    // Add the canvas as image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Generate filename
    const filename = `access-card-${person.name.replace(/\s+/g, '-').toLowerCase()}-${person.id}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};
