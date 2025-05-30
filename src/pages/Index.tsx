
import React, { useState } from 'react';
import { Plus, Users, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonnelForm from '@/components/PersonnelForm';
import PersonnelList from '@/components/PersonnelList';
import AccessCardPreview from '@/components/AccessCardPreview';
import { Personnel } from '@/types/personnel';

const Index = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);

  const addPersonnel = (person: Personnel) => {
    setPersonnel([...personnel, person]);
    setShowForm(false);
  };

  const removePersonnel = (id: string) => {
    setPersonnel(personnel.filter(p => p.id !== id));
    if (selectedPerson?.id === id) {
      setSelectedPerson(null);
    }
  };

  const selectPerson = (person: Personnel) => {
    setSelectedPerson(person);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">TechBootcamp Access</h1>
                <p className="text-sm text-slate-600">Personnel Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Users className="w-4 h-4" />
              <span>{personnel.length} Personnel</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Personnel Management */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Personnel Management</CardTitle>
                  <Button 
                    onClick={() => setShowForm(!showForm)}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Personnel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {showForm && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg border">
                    <PersonnelForm onSubmit={addPersonnel} onCancel={() => setShowForm(false)} />
                  </div>
                )}
                <PersonnelList 
                  personnel={personnel} 
                  onSelect={selectPerson}
                  onRemove={removePersonnel}
                  selectedId={selectedPerson?.id}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Access Card Preview */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
                <CardTitle className="text-lg font-semibold">Access Card Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedPerson ? (
                  <AccessCardPreview person={selectedPerson} />
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No Personnel Selected</h3>
                    <p className="text-slate-500">Select a person from the list to preview their access card</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
