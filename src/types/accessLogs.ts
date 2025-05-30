export interface AccessLog {
  id: string;
  personnel_id: string;
  access_time: string;
  location: string | null;
  access_granted: boolean;
  notes: string | null;
} 