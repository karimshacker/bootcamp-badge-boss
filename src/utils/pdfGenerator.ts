import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Personnel } from '@/types/personnel';
import { generateBarcodeValue, generateBarcodeDataUrl } from './idGenerator';

export const generatePDF = async (element: HTMLElement, person: Personnel): Promise<void> => {
  try {
    // Ensure element is visible and properly sized
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalTop = element.style.top;
    const originalTransform = element.style.transform;
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.transform = 'none';
    element.style.zIndex = '9999';
    await new Promise(resolve => setTimeout(resolve, 500));
    // Render the entire card as a canvas
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
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    element.style.top = originalTop;
    element.style.transform = originalTransform;
    element.style.zIndex = '';
    // PDF dimensions (credit card size)
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidth, cardHeight],
      compress: true,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, cardWidth, cardHeight, undefined, 'FAST');
    pdf.setProperties({
      title: `Access Card - ${person.name}`,
      subject: 'TechBootcamp Professional Access Card',
      author: 'TechBootcamp Access Management System',
      creator: 'TechBootcamp Personnel Management',
      keywords: 'access card, personnel, identification, security',
    });
    const cleanName = person.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `techbootcamp-access-card-${cleanName}-${timestamp}.pdf`;
    pdf.save(filename);
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

export const generateIDCardPDF = async (person: Personnel): Promise<void> => {
  const cardWidth = 85.6;
  const cardHeight = 53.98;
  const margin = 5;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [cardWidth, cardHeight] });

  // Header: blue gradient (simulate with solid blue)
  doc.setFillColor('#2563eb'); // Tailwind blue-600
  doc.rect(0, 0, cardWidth, 13, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('TECHBOOTCAMP', cardWidth / 2, 8, { align: 'center' });
  doc.setFontSize(8);
  doc.text('ID CARD', cardWidth / 2, 12, { align: 'center' });

  // Card body background
  doc.setFillColor('#f8fafc'); // Tailwind slate-50
  doc.rect(0, 13, cardWidth, cardHeight - 13, 'F');

  // Photo
  const photoX = margin + 2;
  const photoY = 17;
  const photoW = 18;
  const photoH = 22;
  if (person.photo) {
    const img = new window.Image();
    img.src = person.photo;
    await new Promise(resolve => { img.onload = resolve; });
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
    const grayPhoto = canvas.toDataURL('image/jpeg', 0.92);
    doc.addImage(grayPhoto, 'JPEG', photoX, photoY, photoW, photoH);
  } else {
    doc.setFillColor('#e0e0e0');
    doc.roundedRect(photoX, photoY, photoW, photoH, 2, 2, 'F');
    doc.setFontSize(18);
    doc.setTextColor(150);
    doc.text(
      person.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      photoX + photoW / 2,
      photoY + photoH / 2 + 5,
      { align: 'center' }
    );
  }

  // Info (right column)
  const infoX = photoX + photoW + 6;
  let infoY = photoY + 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(30, 30, 30);
  doc.text(person.name, infoX, infoY);
  infoY += 7;
  // Role badge
  doc.setFillColor('#2563eb');
  doc.roundedRect(infoX, infoY - 5, 22, 7, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(person.role.toUpperCase(), infoX + 11, infoY, { align: 'center' });
  infoY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`Dept: ${person.department}`, infoX, infoY);
  infoY += 5;
  doc.text(`ID: ${person.id}`, infoX, infoY);
  infoY += 5;
  doc.text(`Email: ${person.email}`, infoX, infoY);
  infoY += 5;
  if (person.phone) {
    doc.text(`Phone: ${person.phone}`, infoX, infoY);
    infoY += 5;
  }
  doc.text(`Status: ${person.status}`, infoX, infoY);
  infoY += 5;
  doc.text(`Expires: ${new Date(person.expiryDate).toLocaleDateString()}`, infoX, infoY);

  // Barcode (smaller, bottom right)
  const barcodeValue = generateBarcodeValue(person.id);
  const barcodeUrl = generateBarcodeDataUrl(barcodeValue, { width: 1.2, height: 18 });
  const barcodeImg = new window.Image();
  barcodeImg.src = barcodeUrl;
  await new Promise(resolve => { barcodeImg.onload = resolve; });
  const barcodeW = 28;
  const barcodeH = 7;
  const barcodeX = cardWidth - margin - barcodeW;
  const barcodeY = cardHeight - margin - barcodeH - 2;
  doc.addImage(barcodeImg, 'PNG', barcodeX, barcodeY, barcodeW, barcodeH);
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(barcodeValue, barcodeX + barcodeW / 2, barcodeY + barcodeH + 3, { align: 'center' });

  // Save
  const cleanName = person.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `techbootcamp-idcard-${cleanName}-${timestamp}.pdf`;
  doc.save(filename);
};
