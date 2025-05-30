
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Personnel } from '@/types/personnel';

export const generatePDF = async (element: HTMLElement, person: Personnel): Promise<void> => {
  try {
    console.log('Starting PDF generation for:', person.name);
    
    // Ensure element is visible and properly sized
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalTop = element.style.top;
    const originalTransform = element.style.transform;
    
    // Temporarily position element for capture
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.transform = 'none';
    element.style.zIndex = '9999';

    // Wait for any images to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create high-quality canvas
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      foreignObjectRendering: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: 1200,
      windowHeight: 800,
    });

    // Restore original element positioning
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    element.style.top = originalTop;
    element.style.transform = originalTransform;
    element.style.zIndex = '';

    console.log('Canvas created with dimensions:', canvas.width, 'x', canvas.height);

    // Calculate PDF dimensions (credit card size: 85.6mm × 53.98mm)
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    
    // Create PDF with high DPI
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidth, cardHeight],
      compress: true,
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Add the image to PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, cardWidth, cardHeight, undefined, 'FAST');

    // Add metadata
    pdf.setProperties({
      title: `Access Card - ${person.name}`,
      subject: 'TechBootcamp Professional Access Card',
      author: 'TechBootcamp Access Management System',
      creator: 'TechBootcamp Personnel Management',
      keywords: 'access card, personnel, identification, security',
    });

    // Generate filename with clean formatting
    const cleanName = person.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `techbootcamp-access-card-${cleanName}-${timestamp}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    console.log(`PDF generated successfully: ${filename}`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateBulkPDF = async (personnel: Personnel[]): Promise<void> => {
  try {
    console.log('Starting bulk PDF generation for', personnel.length, 'personnel');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let isFirstCard = true;
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    const cardsPerPage = 4; // 2x2 layout
    let cardCount = 0;

    for (const person of personnel) {
      if (cardCount > 0 && cardCount % cardsPerPage === 0) {
        pdf.addPage();
      }

      // Calculate position on page (2x2 grid)
      const col = cardCount % 2;
      const row = Math.floor((cardCount % cardsPerPage) / 2);
      const x = 10 + col * (cardWidth + 10);
      const y = 10 + row * (cardHeight + 10);

      // Create a simple card representation for bulk generation
      const cardHtml = `
        <div style="
          width: ${cardWidth * 3.78}px; 
          height: ${cardHeight * 3.78}px; 
          background: linear-gradient(135deg, #3b82f6, #1e40af); 
          color: white; 
          padding: 20px; 
          font-family: Arial, sans-serif;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        ">
          <div style="position: relative; z-index: 10;">
            <h2 style="margin: 0; font-size: 16px; font-weight: bold;">TECHBOOTCAMP</h2>
            <p style="margin: 5px 0; font-size: 10px; opacity: 0.9;">ACCESS CARD</p>
            <div style="margin-top: 20px;">
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">${person.name}</h3>
              <p style="margin: 2px 0; font-size: 12px; text-transform: uppercase;">${person.role}</p>
              <p style="margin: 2px 0; font-size: 10px;">${person.department}</p>
              <p style="margin: 10px 0; font-size: 8px; font-family: monospace;">ID: ${person.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <div style="
            position: absolute; 
            top: -20px; 
            right: -20px; 
            width: 80px; 
            height: 80px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 50%;
          "></div>
        </div>
      `;

      // Create temporary element
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardHtml;
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      const cardElement = tempDiv.firstElementChild as HTMLElement;
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      pdf.addImage(imgData, 'JPEG', x, y, cardWidth, cardHeight);

      cardCount++;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `techbootcamp-bulk-access-cards-${timestamp}.pdf`;
    pdf.save(filename);
    
    console.log(`Bulk PDF generated successfully: ${filename}`);
  } catch (error) {
    console.error('Error generating bulk PDF:', error);
    throw new Error(`Failed to generate bulk PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
