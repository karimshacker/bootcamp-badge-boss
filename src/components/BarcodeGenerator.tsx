import React, { useMemo } from 'react';
import JsBarcode from 'jsbarcode';
import { generateBarcodeValue } from '@/utils/idGenerator';

interface BarcodeGeneratorProps {
  value: string;
  width?: number;
  height?: number;
  className?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  width = 2,
  height = 40,
  className = ''
}) => {
  // Generate barcode as PNG data URL
  const dataUrl = useMemo(() => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, generateBarcodeValue(value), {
      format: 'CODE128',
      width: width,
      height: height,
      displayValue: true,
      fontSize: 12,
      margin: 10,
      background: '#ffffff',
      lineColor: '#000000',
    });
    return canvas.toDataURL('image/png');
  }, [value, width, height]);

  return (
    <div className={`flex justify-center items-center bg-white ${className}`} style={{ borderRadius: 4 }}>
      <img src={dataUrl} alt="Barcode" style={{ height, width: 'auto', maxWidth: 180 }} />
    </div>
  );
};

export default BarcodeGenerator;
