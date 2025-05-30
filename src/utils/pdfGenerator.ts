
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Personnel } from '@/types/personnel';

export const generatePDF = async (element: HTMLElement, person: Personnel): Promise<void> => {
  try {
    // Hide any scrollbars and ensure element is fully visible
    const originalOverflow = element.style.overflow;
    element.style.overflow = 'visible';

    // Create canvas from the element with higher quality
    const canvas = await html2canvas(element, {
      scale: 3, // Increased scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
      foreignObjectRendering: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Restore original overflow
    element.style.overflow = originalOverflow;

    // Calculate dimensions for PDF (credit card size: 85.6mm × 53.98mm)
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    
    // Create PDF with higher DPI
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidth, cardHeight],
      compress: true,
    });

    // Convert canvas to image with better quality
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Add the canvas as image to PDF with precise positioning
    pdf.addImage(imgData, 'PNG', 0, 0, cardWidth, cardHeight, undefined, 'FAST');

    // Add metadata
    pdf.setProperties({
      title: `Access Card - ${person.name}`,
      subject: 'TechBootcamp Access Card',
      author: 'TechBootcamp System',
      creator: 'TechBootcamp Access Management',
      keywords: 'access card, personnel, identification',
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `access-card-${person.name.replace(/\s+/g, '-').toLowerCase()}-${person.id}-${timestamp}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    console.log(`PDF generated successfully: ${filename}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const generateBulkPDF = async (personnel: Personnel[]): Promise<void> => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let isFirstCard = true;

    for (const person of personnel) {
      if (!isFirstCard) {
        pdf.addPage();
      }
      isFirstCard = false;

      // Create a temporary card element for each person
      const tempCard = document.createElement('div');
      tempCard.style.position = 'absolute';
      tempCard.style.left = '-9999px';
      tempCard.style.width = '320px';
      tempCard.style.height = '200px';
      
      // You would need to render the card content here
      // This is a simplified version
      tempCard.innerHTML = `
        <div style="width: 320px; height: 200px; background: white; border: 1px solid #ccc; padding: 16px;">
          <h3>${person.name}</h3>
          <p>${person.role}</p>
          <p>ID: ${person.id}</p>
        </div>
      `;
      
      document.body.appendChild(tempCard);

      const canvas = await html2canvas(tempCard, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(tempCard);

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 85.6, 53.98);
    }

    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`bulk-access-cards-${timestamp}.pdf`);
  } catch (error) {
    console.error('Error generating bulk PDF:', error);
    throw new Error('Failed to generate bulk PDF. Please try again.');
  }
};
