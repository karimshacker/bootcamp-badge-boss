
import { supabase } from '@/integrations/supabase/client';
import { Personnel } from '@/types/personnel';

export interface DatabasePersonnel {
  id: string;
  name: string;
  role: 'organizer' | 'trainer' | 'director';
  email: string;
  department: string;
  access_level: 'basic' | 'standard' | 'full';
  issue_date: string;
  expiry_date: string;
  photo?: string;
  phone?: string;
  emergency_contact?: string;
  status: 'active' | 'inactive' | 'suspended';
  last_access?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const personnelService = {
  async getAllPersonnel(): Promise<Personnel[]> {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching personnel:', error);
      throw error;
    }
    
    return data.map(this.mapToPersonnel);
  },

  async createPersonnel(personnel: Omit<Personnel, 'id' | 'issueDate' | 'expiryDate'>): Promise<Personnel> {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    const { data, error } = await supabase
      .from('personnel')
      .insert({
        name: personnel.name,
        role: personnel.role,
        email: personnel.email,
        department: personnel.department,
        access_level: personnel.accessLevel,
        expiry_date: expiryDate.toISOString(),
        photo: personnel.photo,
        phone: personnel.phone,
        emergency_contact: personnel.emergencyContact,
        status: personnel.status,
        notes: personnel.notes,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating personnel:', error);
      throw error;
    }
    
    return this.mapToPersonnel(data);
  },

  async updatePersonnel(id: string, personnel: Partial<Personnel>): Promise<Personnel> {
    const { data, error } = await supabase
      .from('personnel')
      .update({
        name: personnel.name,
        role: personnel.role,
        email: personnel.email,
        department: personnel.department,
        access_level: personnel.accessLevel,
        photo: personnel.photo,
        phone: personnel.phone,
        emergency_contact: personnel.emergencyContact,
        status: personnel.status,
        notes: personnel.notes,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating personnel:', error);
      throw error;
    }
    
    return this.mapToPersonnel(data);
  },

  async deletePersonnel(id: string): Promise<void> {
    const { error } = await supabase
      .from('personnel')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting personnel:', error);
      throw error;
    }
  },

  async getDepartments(): Promise<string[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('name')
      .order('name');
    
    if (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
    
    return data.map(dept => dept.name);
  },

  mapToPersonnel(dbPersonnel: DatabasePersonnel): Personnel {
    return {
      id: dbPersonnel.id,
      name: dbPersonnel.name,
      role: dbPersonnel.role,
      email: dbPersonnel.email,
      department: dbPersonnel.department,
      accessLevel: dbPersonnel.access_level,
      issueDate: dbPersonnel.issue_date.split('T')[0],
      expiryDate: dbPersonnel.expiry_date.split('T')[0],
      photo: dbPersonnel.photo,
      phone: dbPersonnel.phone,
      emergencyContact: dbPersonnel.emergency_contact,
      status: dbPersonnel.status,
      lastAccess: dbPersonnel.last_access?.split('T')[0],
      notes: dbPersonnel.notes,
    };
  }
};
