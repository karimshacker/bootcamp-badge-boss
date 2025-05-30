import React, { useRef, useState } from 'react';
import { generateBarcodeValue, generateBarcodeDataUrl } from '@/utils/idGenerator';
import { Personnel } from '@/types/personnel';
import { Shield, Download } from 'lucide-react';
import { generateIDCardPDF } from '@/utils/pdfGenerator';

interface ProfessionalAccessCardProps {
  person: Personnel;
}

const ProfessionalAccessCard: React.FC<ProfessionalAccessCardProps> = ({ person }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const barcodeValue = generateBarcodeValue(person.id);
  const barcodeUrl = generateBarcodeDataUrl(barcodeValue, { width: 2.2, height: 38 });
  const [barcodeLoaded, setBarcodeLoaded] = useState(false);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      await generateIDCardPDF(person);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div ref={cardRef} className="w-96 max-w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden font-sans" style={{ aspectRatio: '1.586/1' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-gray-500" />
          <span className="text-lg font-bold tracking-wide text-gray-800">TECHBOOTCAMP</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadPDF}
            className={`flex items-center px-3 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors ${pdfLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            title="Download PDF"
            disabled={pdfLoading}
          >
            <Download className="w-4 h-4 mr-1" />
            {pdfLoading ? 'Exporting...' : 'PDF'}
          </button>
          <span className="text-xs text-gray-400 font-mono">ID CARD</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex px-5 py-4 gap-4">
        {/* Photo */}
        <div className="flex-shrink-0 w-24 h-28 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
          {person.photo ? (
            <img src={person.photo} alt={person.name} className="w-full h-full object-cover grayscale" />
          ) : (
            <span className="text-3xl font-bold text-gray-500">
              {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 truncate">{person.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100 border border-gray-300 rounded px-2 py-0.5">{person.role}</span>
              <span className="text-xs text-gray-500">{person.department}</span>
            </div>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <div><span className="font-semibold">ID:</span> <span className="font-mono">{person.id}</span></div>
              <div><span className="font-semibold">Email:</span> <span className="break-all">{person.email}</span></div>
              {person.phone && <div><span className="font-semibold">Phone:</span> <span>{person.phone}</span></div>}
              <div><span className="font-semibold">Status:</span> <span className="uppercase font-bold tracking-wider text-gray-700">{person.status}</span></div>
              <div><span className="font-semibold">Expires:</span> <span>{new Date(person.expiryDate).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Section */}
      <div className="px-5 pb-4 pt-2 border-t border-gray-100 bg-gray-50 flex flex-col items-center">
        <img
          src={barcodeUrl}
          alt="Barcode"
          style={{ height: 38, width: 'auto', maxWidth: 220, filter: 'grayscale(1)' }}
          onLoad={() => setBarcodeLoaded(true)}
        />
        <span className="text-xs text-gray-500 font-mono tracking-widest mt-1">{barcodeValue}</span>
      </div>
    </div>
  );
};

export default ProfessionalAccessCard;
