import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Shield } from 'lucide-react';
import { Personnel } from '@/types/personnel';
import BarcodeGenerator from './BarcodeGenerator';
import { generatePDF } from '@/utils/pdfGenerator';

interface AccessCardPreviewProps {
  person: Personnel;
}

const AccessCardPreview: React.FC<AccessCardPreviewProps> = ({ person }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      await generatePDF(cardRef.current, person);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'director': return 'from-purple-600 to-purple-700';
      case 'trainer': return 'from-blue-600 to-blue-700';
      case 'organizer': return 'from-green-600 to-green-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'full': return '🔴';
      case 'standard': return '🟡';
      case 'basic': return '⚪';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Access Card */}
      <div 
        ref={cardRef}
        className="w-96 mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border"
        style={{ aspectRatio: '1.586/1' }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getRoleColor(person.role)} px-6 py-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-sm">TECHBOOTCAMP</h3>
                <p className="text-xs opacity-90">ACCESS PASS</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">ID</p>
              <p className="font-mono text-sm font-bold">{person.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Photo placeholder and details */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-600">
                {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 text-lg truncate">{person.name}</h2>
              <p className="text-sm text-slate-600 capitalize">{person.role}</p>
              <p className="text-xs text-slate-500">{person.department}</p>
            </div>
          </div>

          {/* Access Level */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Access Level:</span>
            <div className="flex items-center space-x-1">
              <span>{getAccessLevelIcon(person.accessLevel)}</span>
              <span className="font-medium capitalize">{person.accessLevel}</span>
            </div>
          </div>

          {/* Barcode */}
          <div className="border-t pt-4">
            <BarcodeGenerator value={person.id} />
          </div>

          {/* Dates */}
          <div className="flex justify-between text-xs text-slate-500 border-t pt-2">
            <span>Issued: {new Date(person.issueDate).toLocaleDateString()}</span>
            <span>Expires: {new Date(person.expiryDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <Button 
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF Access Card
        </Button>
      </div>
    </div>
  );
};

export default AccessCardPreview;
