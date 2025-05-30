
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Users, Download, Shield, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Personnel, PersonnelFilters } from '@/types/personnel';
import { useToast } from '@/hooks/use-toast';
import PersonnelList from '@/components/PersonnelList';
import EnhancedPersonnelForm from '@/components/EnhancedPersonnelForm';
import ProfessionalAccessCard from '@/components/ProfessionalAccessCard';
import Dashboard from '@/components/Dashboard';
import PersonnelFiltersComponent from '@/components/PersonnelFilters';
import { personnelService } from '@/services/personnelService';

const Index = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [editingPerson, setEditingPerson] = useState<Personnel | null>(null);
  const [filters, setFilters] = useState<PersonnelFilters>({});
  const [activeTab, setActiveTab] = useState('personnel');
  const [departments, setDepartments] = useState<string[]>([]);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadPersonnel();
    loadDepartments();
  }, []);

  const loadPersonnel = async () => {
    try {
      setLoading(true);
      const data = await personnelService.getAllPersonnel();
      setPersonnel(data);
    } catch (error) {
      console.error('Failed to load personnel:', error);
      toast({
        title: 'Error',
        description: 'Failed to load personnel data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const deps = await personnelService.getDepartments();
      setDepartments(deps);
    } catch (error) {
      console.error('Failed to load departments:', error);
    }
  };

  // Filter personnel based on current filters
  const filteredPersonnel = useMemo(() => {
    return personnel.filter(person => {
      if (filters.search && !person.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !person.email.toLowerCase().includes(filters.search.toLowerCase()) &&
          !person.id.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.role && person.role !== filters.role) return false;
      if (filters.department && person.department !== filters.department) return false;
      if (filters.accessLevel && person.accessLevel !== filters.accessLevel) return false;
      if (filters.status && person.status !== filters.status) return false;
      return true;
    });
  }, [personnel, filters]);

  // Get unique departments for filter dropdown (including database departments)
  const allDepartments = useMemo(() => {
    const personnelDepartments = Array.from(new Set(personnel.map(p => p.department))).filter(Boolean);
    return Array.from(new Set([...departments, ...personnelDepartments]));
  }, [personnel, departments]);

  const addPersonnel = async (person: Personnel) => {
    try {
      if (editingPerson) {
        const updatedPerson = await personnelService.updatePersonnel(person.id, person);
        setPersonnel(prev => prev.map(p => p.id === person.id ? updatedPerson : p));
        setEditingPerson(null);
        if (selectedPerson?.id === person.id) {
          setSelectedPerson(updatedPerson);
        }
        toast({
          title: 'Success',
          description: 'Personnel updated successfully',
        });
      } else {
        const newPerson = await personnelService.createPersonnel(person);
        setPersonnel(prev => [...prev, newPerson]);
        toast({
          title: 'Success',
          description: 'Personnel added successfully',
        });
      }
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save personnel:', error);
      toast({
        title: 'Error',
        description: 'Failed to save personnel',
        variant: 'destructive',
      });
    }
  };

  const removePersonnel = async (id: string) => {
    try {
      await personnelService.deletePersonnel(id);
      setPersonnel(prev => prev.filter(p => p.id !== id));
      if (selectedPerson?.id === id) {
        setSelectedPerson(null);
      }
      toast({
        title: 'Success',
        description: 'Personnel removed successfully',
      });
    } catch (error) {
      console.error('Failed to delete personnel:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete personnel',
        variant: 'destructive',
      });
    }
  };

  const selectPerson = (person: Personnel) => {
    setSelectedPerson(person);
    setActiveTab('card-preview');
  };

  const editPerson = (person: Personnel) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const exportAllData = () => {
    const dataStr = JSON.stringify(personnel, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `personnel-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading personnel data...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-slate-600">Advanced Personnel Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>{personnel.length} Total</span>
                <span>•</span>
                <span>{filteredPersonnel.length} Filtered</span>
              </div>
              <Button
                onClick={exportAllData}
                variant="outline"
                size="sm"
                disabled={personnel.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="personnel" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Personnel</span>
            </TabsTrigger>
            <TabsTrigger value="card-preview" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Access Card</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Dashboard personnel={personnel} />
          </TabsContent>

          {/* Personnel Management Tab */}
          <TabsContent value="personnel" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Personnel Management</CardTitle>
                      <Button 
                        onClick={() => {
                          setEditingPerson(null);
                          setShowForm(!showForm);
                        }}
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Personnel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <PersonnelFiltersComponent
                      filters={filters}
                      onFiltersChange={setFilters}
                      departments={allDepartments}
                    />
                    
                    <PersonnelList 
                      personnel={filteredPersonnel} 
                      onSelect={selectPerson}
                      onRemove={removePersonnel}
                      onEdit={editPerson}
                      selectedId={selectedPerson?.id}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
                    <CardTitle className="text-lg font-semibold">Quick Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedPerson ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center mx-auto mb-3 overflow-hidden">
                            {selectedPerson.photo ? (
                              <img src={selectedPerson.photo} alt={selectedPerson.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg font-bold text-slate-600">
                                {selectedPerson.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900">{selectedPerson.name}</h3>
                          <p className="text-sm text-slate-600 capitalize">{selectedPerson.role}</p>
                        </div>
                        <Button 
                          onClick={() => setActiveTab('card-preview')}
                          className="w-full"
                        >
                          View Full Card
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Select a person to preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Access Card Preview Tab */}
          <TabsContent value="card-preview">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
                <CardTitle className="text-lg font-semibold">Professional Access Card</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedPerson ? (
                  <ProfessionalAccessCard person={selectedPerson} />
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No Personnel Selected</h3>
                    <p className="text-slate-500 mb-4">Select a person from the personnel list to preview their access card</p>
                    <Button onClick={() => setActiveTab('personnel')}>
                      Go to Personnel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <EnhancedPersonnelForm 
                onSubmit={addPersonnel} 
                onCancel={() => {
                  setShowForm(false);
                  setEditingPerson(null);
                }}
                initialData={editingPerson || undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
