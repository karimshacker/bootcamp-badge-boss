
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Personnel } from '@/types/personnel';
import { generatePersonnelId } from '@/utils/idGenerator';

interface PersonnelFormProps {
  onSubmit: (person: Personnel) => void;
  onCancel: () => void;
}

const PersonnelForm: React.FC<PersonnelFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'trainer' as const,
    email: '',
    department: '',
    accessLevel: 'standard' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const personnel: Personnel = {
      id: generatePersonnelId(formData.role),
      ...formData,
      issueDate: now.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
    };

    onSubmit(personnel);
    setFormData({
      name: '',
      role: 'trainer',
      email: '',
      department: '',
      accessLevel: 'standard',
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="trainer">Trainer</SelectItem>
              <SelectItem value="director">Director</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => updateFormData('department', e.target.value)}
            placeholder="e.g., Web Development"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessLevel">Access Level</Label>
          <Select value={formData.accessLevel} onValueChange={(value) => updateFormData('accessLevel', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Access</SelectItem>
              <SelectItem value="standard">Standard Access</SelectItem>
              <SelectItem value="full">Full Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Add Personnel
        </Button>
      </div>
    </form>
  );
};

export default PersonnelForm;
