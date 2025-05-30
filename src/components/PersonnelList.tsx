
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, User } from 'lucide-react';
import { Personnel } from '@/types/personnel';

interface PersonnelListProps {
  personnel: Personnel[];
  onSelect: (person: Personnel) => void;
  onRemove: (id: string) => void;
  selectedId?: string;
}

const PersonnelList: React.FC<PersonnelListProps> = ({ 
  personnel, 
  onSelect, 
  onRemove, 
  selectedId 
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'director': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'trainer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'organizer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-red-100 text-red-800 border-red-200';
      case 'standard': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'basic': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (personnel.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">No Personnel Added</h3>
        <p className="text-slate-500">Add your first team member to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {personnel.map((person) => (
        <div
          key={person.id}
          className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
            selectedId === person.id 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
          onClick={() => onSelect(person)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-slate-900">{person.name}</h3>
                <Badge className={getRoleBadgeColor(person.role)}>
                  {person.role.charAt(0).toUpperCase() + person.role.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-slate-600">
                <p><span className="font-medium">ID:</span> {person.id}</p>
                <p><span className="font-medium">Email:</span> {person.email}</p>
                <p><span className="font-medium">Department:</span> {person.department}</p>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getAccessLevelColor(person.accessLevel)}>
                  {person.accessLevel.charAt(0).toUpperCase() + person.accessLevel.slice(1)} Access
                </Badge>
                <span className="text-xs text-slate-500">
                  Expires: {new Date(person.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(person.id);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PersonnelList;
