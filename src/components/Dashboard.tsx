
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Clock, AlertTriangle } from 'lucide-react';
import { Personnel, DashboardStats } from '@/types/personnel';

interface DashboardProps {
  personnel: Personnel[];
}

const Dashboard: React.FC<DashboardProps> = ({ personnel }) => {
  const calculateStats = (): DashboardStats => {
    const total = personnel.length;
    const active = personnel.filter(p => p.status === 'active').length;
    const inactive = personnel.filter(p => p.status === 'inactive').length;
    const suspended = personnel.filter(p => p.status === 'suspended').length;

    const byRole = personnel.reduce((acc, p) => {
      acc[p.role] = (acc[p.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDepartment = personnel.reduce((acc, p) => {
      acc[p.department] = (acc[p.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoon = personnel.filter(p => 
      new Date(p.expiryDate) <= thirtyDaysFromNow && p.status === 'active'
    ).length;

    return { total, active, inactive, suspended, byRole, byDepartment, expiringSoon };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Personnel" 
          value={stats.total} 
          icon={Users} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Active Cards" 
          value={stats.active} 
          icon={Shield} 
          color="text-green-600" 
        />
        <StatCard 
          title="Expiring Soon" 
          value={stats.expiringSoon} 
          icon={Clock} 
          color="text-orange-600" 
        />
        <StatCard 
          title="Suspended" 
          value={stats.suspended} 
          icon={AlertTriangle} 
          color="text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personnel by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.byRole).map(([role, count]) => (
                <div key={role} className="flex justify-between items-center">
                  <span className="capitalize">{role}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personnel by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.byDepartment).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center">
                  <span>{dept}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
