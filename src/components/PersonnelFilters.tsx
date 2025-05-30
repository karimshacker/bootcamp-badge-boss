
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { PersonnelFilters } from '@/types/personnel';

interface PersonnelFiltersProps {
  filters: PersonnelFilters;
  onFiltersChange: (filters: PersonnelFilters) => void;
  departments: string[];
}

const PersonnelFiltersComponent: React.FC<PersonnelFiltersProps> = ({
  filters,
  onFiltersChange,
  departments
}) => {
  const updateFilter = (key: keyof PersonnelFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="font-medium text-slate-700">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search personnel..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.role || 'all'} onValueChange={(value) => updateFilter('role', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="organizer">Organizer</SelectItem>
            <SelectItem value="trainer">Trainer</SelectItem>
            <SelectItem value="director">Director</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.department || 'all'} onValueChange={(value) => updateFilter('department', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.accessLevel || 'all'} onValueChange={(value) => updateFilter('accessLevel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Access Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Access Levels</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="full">Full</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PersonnelFiltersComponent;
