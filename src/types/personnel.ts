
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
}

export interface AccessCard {
  personnel: Personnel;
  barcode: string;
  cardId: string;
}
