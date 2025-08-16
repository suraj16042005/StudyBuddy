import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';

interface MobileFilterDrawerProps {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
}

export function MobileFilterDrawer({ onFilterChange, onResetFilters }: MobileFilterDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 md:hidden">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter Mentors</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <FilterSidebar onFilterChange={onFilterChange} onResetFilters={onResetFilters} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
