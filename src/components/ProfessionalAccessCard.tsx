
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Shield, CheckCircle, Lock, AlertTriangle } from 'lucide-react';
import { Personnel } from '@/types/personnel';
import BarcodeGenerator from './BarcodeGenerator';
import { generatePDF } from '@/utils/pdfGenerator';

interface ProfessionalAccessCardProps {
  person: Personnel;
}

const ProfessionalAccessCard: React.FC<ProfessionalAccessCardProps> = ({ person }) => {
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

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'director': 
        return { 
          gradient: 'from-purple-600 via-purple-700 to-purple-800',
          accent: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: '👑'
        };
      case 'trainer': 
        return { 
          gradient: 'from-blue-600 via-blue-700 to-blue-800',
          accent: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🎓'
        };
      case 'organizer': 
        return { 
          gradient: 'from-green-600 via-green-700 to-green-800',
          accent: 'bg-green-100 text-green-800 border-green-200',
          icon: '📋'
        };
      default: 
        return { 
          gradient: 'from-gray-600 via-gray-700 to-gray-800',
          accent: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '👤'
        };
    }
  };

  const getAccessLevelConfig = (level: string) => {
    switch (level) {
      case 'full': 
        return { 
          color: 'text-red-700 bg-red-50 border-red-200', 
          badge: 'FULL ACCESS',
          icon: '🔴'
        };
      case 'standard': 
        return { 
          color: 'text-orange-700 bg-orange-50 border-orange-200', 
          badge: 'STANDARD',
          icon: '🟡'
        };
      case 'basic': 
        return { 
          color: 'text-blue-700 bg-blue-50 border-blue-200', 
          badge: 'BASIC',
          icon: '🔵'
        };
      default: 
        return { 
          color: 'text-gray-700 bg-gray-50 border-gray-200', 
          badge: 'UNKNOWN',
          icon: '⚪'
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': 
        return { 
          color: 'text-green-700 bg-green-100 border-green-300', 
          icon: CheckCircle,
          label: 'ACTIVE'
        };
      case 'inactive': 
        return { 
          color: 'text-gray-700 bg-gray-100 border-gray-300', 
          icon: Lock,
          label: 'INACTIVE'
        };
      case 'suspended': 
        return { 
          color: 'text-red-700 bg-red-100 border-red-300', 
          icon: AlertTriangle,
          label: 'SUSPENDED'
        };
      default: 
        return { 
          color: 'text-gray-700 bg-gray-100 border-gray-300', 
          icon: Lock,
          label: 'UNKNOWN'
        };
    }
  };

  const roleConfig = getRoleConfig(person.role);
  const accessConfig = getAccessLevelConfig(person.accessLevel);
  const statusConfig = getStatusConfig(person.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Professional Access Card */}
      <div className="flex justify-center">
        <div 
          ref={cardRef}
          className="w-96 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          style={{ aspectRatio: '1.586/1' }}
        >
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-br ${roleConfig.gradient} px-6 py-4 text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white transform -translate-x-8 translate-y-8"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-wide">TECHBOOTCAMP</h1>
                    <p className="text-sm opacity-90 font-medium">ACCESS CREDENTIALS</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-xs font-bold">{statusConfig.label}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div className={`${roleConfig.accent} px-3 py-1 rounded-lg border backdrop-blur-sm`}>
                  <span className="text-xs font-bold flex items-center space-x-1">
                    <span>{roleConfig.icon}</span>
                    <span className="uppercase">{person.role}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">ID</p>
                  <p className="font-mono text-sm font-bold tracking-wider">{person.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
            {/* Photo and Personal Info */}
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                {person.photo ? (
                  <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-700">
                    {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">{person.name}</h2>
                <p className="text-sm text-gray-600 capitalize font-medium">{person.department}</p>
                <p className="text-xs text-gray-500 truncate">{person.email}</p>
                {person.phone && (
                  <p className="text-xs text-gray-500 font-mono">{person.phone}</p>
                )}
              </div>
            </div>

            {/* Access Level */}
            <div className={`flex items-center justify-between p-3 rounded-xl ${accessConfig.color} border-2`}>
              <span className="text-sm font-bold">ACCESS LEVEL</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{accessConfig.icon}</span>
                <span className="font-bold text-sm">{accessConfig.badge}</span>
              </div>
            </div>

            {/* Barcode Section */}
            <div className="border-t-2 border-dashed border-gray-200 pt-4">
              <div className="bg-white rounded-lg p-3 border-2 border-gray-200 shadow-sm">
                <BarcodeGenerator value={person.id} width={1.8} height={40} />
                <p className="text-center text-xs text-gray-500 mt-2 font-mono tracking-wide">
                  {person.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Footer with Dates */}
            <div className="flex justify-between text-xs text-gray-600 bg-gray-100 rounded-lg p-3 border">
              <div className="text-center">
                <p className="font-bold text-gray-700">ISSUED</p>
                <p className="font-mono">{new Date(person.issueDate).toLocaleDateString()}</p>
              </div>
              <div className="w-px bg-gray-400"></div>
              <div className="text-center">
                <p className="font-bold text-gray-700">EXPIRES</p>
                <p className="font-mono">{new Date(person.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download High-Quality PDF Card
        </Button>
      </div>

      {/* Additional Information */}
      {(person.emergencyContact || person.notes) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4 border border-blue-200">
          <h4 className="font-bold text-gray-800 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Additional Information</span>
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {person.emergencyContact && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <span className="font-semibold text-gray-700">Emergency Contact:</span>
                <p className="text-gray-900 mt-1">{person.emergencyContact}</p>
              </div>
            )}
            
            {person.notes && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <span className="font-semibold text-gray-700">Notes:</span>
                <p className="text-gray-900 mt-1">{person.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAccessCard;
