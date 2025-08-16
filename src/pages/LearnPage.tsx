import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3X3, List, Search, Loader2 } from 'lucide-react';
import { MOCK_MENTORS, Mentor } from '@/data/mentors';
import { MentorCard } from '@/components/learn/MentorCard';
import { FilterSidebar } from '@/components/learn/FilterSidebar';
import { MobileFilterDrawer } from '@/components/learn/MobileFilterDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { SUBJECT_CATEGORIES } from '@/data/subjects';
import { useToast } from '@/hooks/use-toast'; // Corrected import path

export function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      let results = MOCK_MENTORS;

      // Apply search
      if (searchQuery) {
        results = results.filter(
          (mentor) =>
            mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.subjects.some((s) =>
              s.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      // Apply filters
      if (filters.priceRange) {
        results = results.filter(
          (mentor) =>
            mentor.pricePerHour >= filters.priceRange[0] &&
            mentor.pricePerHour <= filters.priceRange[1]
        );
      }
      if (filters.selectedLanguages && filters.selectedLanguages.length > 0) {
        results = results.filter((mentor) =>
          mentor.languages.some((lang) =>
            filters.selectedLanguages.includes(lang.code)
          )
        );
      }
      if (filters.selectedSubjects && filters.selectedSubjects.length > 0) {
        results = results.filter((mentor) =>
          mentor.subjects.some((subject) =>
            filters.selectedSubjects.includes(subject) ||
            filters.selectedSubjects.some(s => SUBJECT_CATEGORIES.find(cat => cat.id === s)?.subcategories?.some(sub => sub.id === subject))
          )
        );
      }
      if (filters.availability === 'today') {
        results = results.filter(mentor => mentor.isAvailableNow);
      }
      // More complex availability/timeSlot filtering would require actual date logic
      if (filters.sessionType) {
        // This mock data doesn't have session type per mentor, only per course.
        // For a real app, mentors would declare session types they offer.
        // For now, we'll simulate by checking if they have any course of that type.
        results = results.filter(mentor => mentor.courses?.some(course => course.sessionType.toLowerCase().includes(filters.sessionType)));
      }
      if (filters.mentorFeatures && filters.mentorFeatures.length > 0) {
        // Mock data doesn't have explicit mentor features, so this filter won't change results.
        // In a real app, mentors would have a list of features.
      }
      if (filters.experienceLevel) {
        // Mock data doesn't have explicit experience levels, so this filter won't change results.
        // In a real app, mentors would have an experience level field.
      }


      // Apply sorting
      results.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price-low-to-high':
            return a.pricePerHour - b.pricePerHour;
          case 'price-high-to-low':
            return b.pricePerHour - a.pricePerHour;
          case 'most-popular':
            return b.reviewCount - a.reviewCount; // Using review count as proxy for popularity
          case 'relevance':
          default:
            return 0; // No specific sort for relevance without a scoring algorithm
        }
      });

      setFilteredMentors(results);
      setLoading(false);
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
    toast({ title: "Filters Cleared", description: "All search filters have been reset.", duration: 2000 });
  };

  const skeletonCards = Array.from({ length: 6 }).map((_, i) => (
    <Card key={i} className="w-[320px] h-[400px] flex flex-col rounded-xl shadow-md overflow-hidden">
      <Skeleton className="h-40 w-full rounded-t-xl" />
      <CardContent className="flex-grow p-4 text-center space-y-2">
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <div className="flex items-center justify-center gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div> {/* This was the missing closing div */}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardFooter>
    </Card>
  ));


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-on-surface">Find a Mentor</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-extrabold text-foreground mb-8 text-center md:text-left">
        Discover Your Perfect Mentor
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden md:block w-1/4 sticky top-20 h-[calc(100vh-100px)] overflow-y-auto pr-4">
          <FilterSidebar onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
        </aside>

        {/* Main Content Area */}
        <main className="w-full md:w-3/4">
          {/* Search, Sort, View Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-auto flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
              <Input
                type="text"
                placeholder="Search by name, subject, or keyword..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
                  <SelectItem value="most-popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup
                type="single"
                value={viewType}
                onValueChange={(value: 'grid' | 'list') => value && setViewType(value)}
                className="hidden sm:flex"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Mobile Filter Drawer Trigger */}
          <div className="md:hidden mb-6">
            <MobileFilterDrawer onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
          </div>

          <div className="mb-6 text-sm text-on-surface-variant">
            {loading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <span>Showing {filteredMentors.length} results</span>
            )}
          </div>

          {loading ? (
            <div className={viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid grid-cols-1 gap-6'}>
              {skeletonCards}
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-on-surface-variant">
              <img
                src="https://images.pexels.com/photos/743986/pexels-photo-743986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="No results found"
                className="w-64 h-auto mb-6 rounded-lg shadow-lg"
              />
              <h3 className="text-xl font-semibold text-on-surface mb-2">No Mentors Found</h3>
              <p className="max-w-md">
                Try adjusting your filters or search query. We're always adding new mentors!
              </p>
              <Button onClick={handleResetFilters} className="mt-6">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewType === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'grid grid-cols-1 gap-6'
              }
            >
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} viewType={viewType} />
              ))}
            </div>
          )}

          {/* Basic Pagination/Load More (can be expanded to infinite scroll) */}
          {!loading && filteredMentors.length > 0 && (
            <div className="flex justify-center mt-10">
              <Button variant="default" onClick={() => toast({ title: "Load More", description: "More mentors would be loaded here in a real application.", duration: 2000 })}>
                Load More Mentors
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
