
export const generatePersonnelId = (role: string): string => {
  const prefix = role.toUpperCase().substring(0, 3);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `TB-${prefix}-${timestamp}-${random}`;
};

export const generateBarcodeValue = (personnelId: string): string => {
  return personnelId.replace(/-/g, '');
};
