import JsBarcode from 'jsbarcode';

export const generatePersonnelId = (role: string): string => {
  const prefix = role.toUpperCase().substring(0, 3);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `TB-${prefix}-${timestamp}-${random}`;
};

export const generateBarcodeValue = (personnelId: string): string => {
  return personnelId.replace(/-/g, '');
};

export const generateBarcodeDataUrl = (value: string, options: { width?: number; height?: number } = {}): string => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, value, {
    format: 'CODE128',
    width: options.width || 2,
    height: options.height || 40,
    displayValue: true,
    fontSize: 12,
    margin: 10,
    background: '#ffffff',
    lineColor: '#000000',
  });
  return canvas.toDataURL('image/png');
};
