import { supabase } from '@/integrations/supabase/client';

export interface AccessLog {
  id: string;
  personnel_id: string;
  access_time: string;
  location: string | null;
  access_granted: boolean;
  notes: string | null;
}

export const accessLogsService = {
  async getAllLogs(): Promise<AccessLog[]> {
    const { data, error } = await supabase
      .from('access_logs')
      .select('*')
      .order('access_time', { ascending: false });
    if (error) throw error;
    return data as AccessLog[];
  },
  async createLog(log: Omit<AccessLog, 'id'>): Promise<AccessLog> {
    const { data, error } = await supabase
      .from('access_logs')
      .insert(log)
      .select()
      .single();
    if (error) throw error;
    return data as AccessLog;
  },
  async updateLog(id: string, log: Partial<AccessLog>): Promise<AccessLog> {
    const { data, error } = await supabase
      .from('access_logs')
      .update(log)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as AccessLog;
  },
  async deleteLog(id: string): Promise<void> {
    const { error } = await supabase
      .from('access_logs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
}; 