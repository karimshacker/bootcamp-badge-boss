
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Shield, QrCode } from 'lucide-react';
import { Personnel } from '@/types/personnel';
import BarcodeGenerator from './BarcodeGenerator';
import { generatePDF } from '@/utils/pdfGenerator';

interface EnhancedAccessCardPreviewProps {
  person: Personnel;
}

const EnhancedAccessCardPreview: React.FC<EnhancedAccessCardPreviewProps> = ({ person }) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-gray-600';
      case 'suspended': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Access Card */}
      <div 
        ref={cardRef}
        className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border"
        style={{ aspectRatio: '1.586/1' }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getRoleColor(person.role)} px-6 py-4 text-white relative`}>
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
          
          {/* Status indicator */}
          <div className="absolute top-2 right-2">
            <div className={`w-3 h-3 rounded-full ${
              person.status === 'active' ? 'bg-green-400' :
              person.status === 'inactive' ? 'bg-gray-400' : 'bg-red-400'
            }`} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Photo and details */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
              {person.photo ? (
                <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-slate-600">
                  {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 text-lg truncate">{person.name}</h2>
              <p className="text-sm text-slate-600 capitalize">{person.role}</p>
              <p className="text-xs text-slate-500">{person.department}</p>
              <p className={`text-xs font-medium capitalize ${getStatusColor(person.status)}`}>
                {person.status}
              </p>
            </div>
          </div>

          {/* Access Level and Contact */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Access Level:</span>
              <div className="flex items-center space-x-1">
                <span>{getAccessLevelIcon(person.accessLevel)}</span>
                <span className="font-medium capitalize">{person.accessLevel}</span>
              </div>
            </div>
            
            {person.phone && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Phone:</span>
                <span className="font-medium text-xs">{person.phone}</span>
              </div>
            )}
          </div>

          {/* Barcode */}
          <div className="border-t pt-4">
            <BarcodeGenerator value={person.id} width={1.5} height={30} />
          </div>

          {/* Dates */}
          <div className="flex justify-between text-xs text-slate-500 border-t pt-2">
            <span>Issued: {new Date(person.issueDate).toLocaleDateString()}</span>
            <span>Expires: {new Date(person.expiryDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-3">
        <Button 
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Additional Information */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
        <h4 className="font-semibold text-slate-700">Card Information</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="font-medium">Email:</span> {person.email}</div>
          {person.emergencyContact && (
            <div><span className="font-medium">Emergency:</span> {person.emergencyContact}</div>
          )}
          {person.lastAccess && (
            <div><span className="font-medium">Last Access:</span> {new Date(person.lastAccess).toLocaleDateString()}</div>
          )}
        </div>
        {person.notes && (
          <div className="pt-2 border-t">
            <span className="font-medium">Notes:</span> {person.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAccessCardPreview;
