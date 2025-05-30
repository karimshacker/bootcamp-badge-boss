
export interface Personnel {
  id: string;
  name: string;
  role: 'organizer' | 'trainer' | 'director';
  email: string;
  department: string;
  accessLevel: 'basic' | 'standard' | 'full';
  issueDate: string;
  expiryDate: string;
  photo?: string;
  phone?: string;
  emergencyContact?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastAccess?: string;
  notes?: string;
}

export interface AccessCard {
  personnel: Personnel;
  barcode: string;
  cardId: string;
}

export interface PersonnelFilters {
  role?: string;
  department?: string;
  accessLevel?: string;
  status?: string;
  search?: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: Record<string, number>;
  byDepartment: Record<string, number>;
  expiringSoon: number;
}
