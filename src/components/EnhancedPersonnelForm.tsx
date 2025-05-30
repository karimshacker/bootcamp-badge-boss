
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { Personnel } from '@/types/personnel';
import { generatePersonnelId } from '@/utils/idGenerator';

interface EnhancedPersonnelFormProps {
  onSubmit: (person: Personnel) => void;
  onCancel: () => void;
  initialData?: Personnel;
}

const EnhancedPersonnelForm: React.FC<EnhancedPersonnelFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || 'trainer' as const,
    email: initialData?.email || '',
    department: initialData?.department || '',
    accessLevel: initialData?.accessLevel || 'standard' as const,
    phone: initialData?.phone || '',
    emergencyContact: initialData?.emergencyContact || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'active' as const,
  });

  const [photo, setPhoto] = useState<string | null>(initialData?.photo || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const personnel: Personnel = {
      id: initialData?.id || generatePersonnelId(formData.role),
      ...formData,
      photo: photo || undefined,
      issueDate: initialData?.issueDate || now.toISOString().split('T')[0],
      expiryDate: initialData?.expiryDate || expiryDate.toISOString().split('T')[0],
      lastAccess: initialData?.lastAccess,
    };

    onSubmit(personnel);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Personnel' : 'Add New Personnel'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo Upload Section */}
            <div className="space-y-4">
              <Label>Photo</Label>
              <div className="flex flex-col items-center space-y-4">
                {photo ? (
                  <div className="relative">
                    <img 
                      src={photo} 
                      alt="Personnel" 
                      className="w-32 h-32 rounded-lg object-cover border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                    placeholder="Emergency contact number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
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
                  <Label htmlFor="department">Department *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {initialData ? 'Update Personnel' : 'Add Personnel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedPersonnelForm;
