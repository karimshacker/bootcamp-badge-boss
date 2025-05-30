import { supabase } from '@/integrations/supabase/client';

export interface Department {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const departmentsService = {
  async getAllDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as Department[];
  },
  async createDepartment(dept: Omit<Department, 'id' | 'created_at'>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert(dept)
      .select()
      .single();
    if (error) throw error;
    return data as Department;
  },
  async updateDepartment(id: string, dept: Partial<Department>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(dept)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Department;
  },
  async deleteDepartment(id: string): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
}; 