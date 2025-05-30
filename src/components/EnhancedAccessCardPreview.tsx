
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Shield, QrCode, Lock, CheckCircle } from 'lucide-react';
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
      try {
        await generatePDF(cardRef.current, person);
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'director': return 'from-purple-600 via-purple-700 to-purple-800';
      case 'trainer': return 'from-blue-600 via-blue-700 to-blue-800';
      case 'organizer': return 'from-green-600 via-green-700 to-green-800';
      default: return 'from-gray-600 via-gray-700 to-gray-800';
    }
  };

  const getAccessLevelConfig = (level: string) => {
    switch (level) {
      case 'full': return { icon: '🔴', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'standard': return { icon: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      case 'basic': return { icon: '⚪', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
      default: return { icon: '⚪', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
      case 'inactive': return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Lock };
      case 'suspended': return { color: 'text-red-600', bg: 'bg-red-100', icon: Lock };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Lock };
    }
  };

  const accessConfig = getAccessLevelConfig(person.accessLevel);
  const statusConfig = getStatusConfig(person.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Enhanced Access Card */}
      <div 
        ref={cardRef}
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100"
        style={{ aspectRatio: '1.586/1' }}
      >
        {/* Enhanced Header with Gradient and Pattern */}
        <div className={`bg-gradient-to-br ${getRoleColor(person.role)} px-6 py-5 text-white relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-12 translate-y-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">TECHBOOTCAMP</h3>
                  <p className="text-xs opacity-90 font-medium">ACCESS PASS</p>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm`}>
                <div className={`w-2 h-2 rounded-full ${
                  person.status === 'active' ? 'bg-green-400' :
                  person.status === 'inactive' ? 'bg-gray-400' : 'bg-red-400'
                }`} />
                <span className="text-xs font-medium capitalize">{person.status}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs opacity-75">ID</p>
              <p className="font-mono text-sm font-bold tracking-wider">{person.id}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
          {/* Photo and Primary Details */}
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white">
              {person.photo ? (
                <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-slate-700">
                  {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 text-xl truncate">{person.name}</h2>
              <p className="text-sm text-slate-600 capitalize font-medium">{person.role}</p>
              <p className="text-xs text-slate-500">{person.department}</p>
              <div className={`inline-flex items-center space-x-1 mt-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                <span className="capitalize">{person.status}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Access Level and Contact Info */}
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${accessConfig.bg} ${accessConfig.border} border`}>
              <span className="text-sm font-medium text-slate-700">Access Level</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{accessConfig.icon}</span>
                <span className={`font-bold capitalize ${accessConfig.color}`}>{person.accessLevel}</span>
              </div>
            </div>
            
            {person.phone && (
              <div className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border">
                <span className="text-slate-600">Phone:</span>
                <span className="font-mono text-xs text-slate-800">{person.phone}</span>
              </div>
            )}
          </div>

          {/* Enhanced Barcode Section */}
          <div className="border-t-2 border-dashed border-slate-200 pt-4">
            <div className="bg-white rounded-lg p-3 border shadow-sm">
              <BarcodeGenerator value={person.id} width={1.5} height={35} />
              <p className="text-center text-xs text-slate-500 mt-1 font-mono">{person.id}</p>
            </div>
          </div>

          {/* Enhanced Footer with Dates */}
          <div className="flex justify-between text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border-t">
            <div className="text-center">
              <p className="font-medium text-slate-600">Issued</p>
              <p className="font-mono">{new Date(person.issueDate).toLocaleDateString()}</p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div className="text-center">
              <p className="font-medium text-slate-600">Expires</p>
              <p className="font-mono">{new Date(person.expiryDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Actions */}
      <div className="flex justify-center space-x-3">
        <Button 
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download High-Quality PDF
        </Button>
      </div>

      {/* Enhanced Additional Information */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 space-y-4 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-slate-600" />
          <h4 className="font-semibold text-slate-700">Card Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border">
            <span className="font-medium text-slate-600">Email:</span>
            <p className="text-slate-800 break-all">{person.email}</p>
          </div>
          
          {person.emergencyContact && (
            <div className="bg-white rounded-lg p-3 border">
              <span className="font-medium text-slate-600">Emergency Contact:</span>
              <p className="text-slate-800">{person.emergencyContact}</p>
            </div>
          )}
          
          {person.lastAccess && (
            <div className="bg-white rounded-lg p-3 border">
              <span className="font-medium text-slate-600">Last Access:</span>
              <p className="text-slate-800">{new Date(person.lastAccess).toLocaleDateString()}</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg p-3 border">
            <span className="font-medium text-slate-600">Card Type:</span>
            <p className="text-slate-800 capitalize">{person.role} Access Card</p>
          </div>
        </div>
        
        {person.notes && (
          <div className="pt-3 border-t border-slate-200">
            <div className="bg-white rounded-lg p-3 border">
              <span className="font-medium text-slate-600">Notes:</span>
              <p className="text-slate-800 mt-1">{person.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAccessCardPreview;
