import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { SUBJECT_CATEGORIES } from '@/data/subjects';
import { LANGUAGES } from '@/data/languages';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
}

export function FilterSidebar({ onFilterChange, onResetFilters }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 2000]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'1-on-1' | 'group' | null>(null);
  const [groupSize, setGroupSize] = useState<string | null>(null);
  const [mentorFeatures, setMentorFeatures] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);

  const handleLanguageChange = (langCode: string, checked: boolean) => {
    setSelectedLanguages((prev) =>
      checked ? [...prev, langCode] : prev.filter((l) => l !== langCode)
    );
  };

  const handleSelectAllLanguages = (checked: boolean) => {
    if (checked) {
      setSelectedLanguages(LANGUAGES.map((lang) => lang.code));
    } else {
      setSelectedLanguages([]);
    }
  };

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    setSelectedSubjects((prev) =>
      checked ? [...prev, subjectId] : prev.filter((s) => s !== subjectId)
    );
  };

  const handleMentorFeatureChange = (feature: string, checked: boolean) => {
    setMentorFeatures((prev) =>
      checked ? [...prev, feature] : prev.filter((f) => f !== feature)
    );
  };

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      selectedLanguages,
      selectedSubjects,
      availability,
      timeSlot,
      sessionType,
      groupSize,
      mentorFeatures,
      experienceLevel,
    });
  };

  const resetAllFilters = () => {
    setPriceRange([50, 2000]);
    setSelectedLanguages([]);
    setSelectedSubjects([]);
    setAvailability(null);
    setTimeSlot(null);
    setSessionType(null);
    setGroupSize(null);
    setMentorFeatures([]);
    setExperienceLevel(null);
    onResetFilters();
  };

  return (
    <div className="p-4 space-y-6 bg-card rounded-xl shadow-lg border">
      <h2 className="text-xl font-bold text-on-surface">Filters</h2>
      <Button onClick={resetAllFilters} variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
        Reset All Filters
      </Button>

      <Accordion type="multiple" className="w-full">
        {/* Price Range Filter */}
        <AccordionItem value="price-range">
          <AccordionTrigger className="text-base font-semibold text-on-surface">Price Range</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Slider
              min={50}
              max={2000}
              step={50}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>₹{priceRange[0]} ({priceRange[0]} coins)</span>
              <span>₹{priceRange[1]} ({priceRange[1]} coins)</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <Separator className="my-4" />

        {/* Language Filter */}
        <AccordionItem value="language-filter">
          <AccordionTrigger className="text-base font-semibold text-on-surface">Language</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="select-all-languages"
                checked={selectedLanguages.length === LANGUAGES.length}
                onCheckedChange={(checked) => handleSelectAllLanguages(checked as boolean)}
              />
              <Label htmlFor="select-all-languages" className="font-medium text-on-surface">
                Select All
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${lang.code}`}
                    checked={selectedLanguages.includes(lang.code)}
                    onCheckedChange={(checked) => handleLanguageChange(lang.code, checked as boolean)}
                  />
                  <Label htmlFor={`lang-${lang.code}`} className="flex items-center gap-1 text-on-surface-variant">
                    {lang.flag} {lang.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <Separator className="my-4" />

        {/* Subject Categories */}
        <AccordionItem value="subject-categories">
          <AccordionTrigger className="text-base font-semibold text-on-surface">Subject Categories</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {SUBJECT_CATEGORIES.map((category) => (
              <Accordion type="single" collapsible key={category.id} className="w-full pl-2">
                <AccordionItem value={category.id}>
                  <AccordionTrigger className="text-sm font-medium py-2">
                    <div className="flex items-center justify-between w-full pr-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${category.id}`}
                          checked={selectedSubjects.includes(category.id)}
                          onCheckedChange={(checked) => handleSubjectChange(category.id, checked as boolean)}
                        />
                        <Label htmlFor={`cat-${category.id}`} className="text-on-surface-variant">{category.name}</Label>
                      </div>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                        {category.mentors}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 pl-6 pt-2">
                    {category.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sub-${sub.id}`}
                          checked={selectedSubjects.includes(sub.id)}
                          onCheckedChange={(checked) => handleSubjectChange(sub.id, checked as boolean)}
                        />
                        <Label htmlFor={`sub-${sub.id}`} className="flex items-center gap-1 text-on-surface-variant">
                          {sub.name}
                          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                            {sub.mentors}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </AccordionContent>
        </AccordionItem>

        <Separator className="my-4" />

        {/* Availability Filter */}
        <AccordionItem value="availability-filter">
          <AccordionTrigger className="text-base font-semibold text-on-surface">Availability</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <ToggleGroup
              type="single"
              value={availability || ''}
              onValueChange={(value) => setAvailability(value || null)}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem value="today" aria-label="Available Today" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Available Today
              </ToggleGroupItem>
              <ToggleGroupItem value="this-week" aria-label="This Week" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                This Week
              </ToggleGroupItem>
              <ToggleGroupItem value="weekends-only" aria-label="Weekends Only" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Weekends Only
              </ToggleGroupItem>
            </ToggleGroup>
            <Label className="block text-sm font-medium text-on-surface mb-2">Time Slot</Label>
            <ToggleGroup
              type="single"
              value={timeSlot || ''}
              onValueChange={(value) => setTimeSlot(value || null)}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem value="morning" aria-label="Morning" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Morning
              </ToggleGroupItem>
              <ToggleGroupItem value="afternoon" aria-label="Afternoon" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Afternoon
              </ToggleGroupItem>
              <ToggleGroupItem value="evening" aria-label="Evening" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Evening
              </ToggleGroupItem>
              <ToggleGroupItem value="night" aria-label="Night" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Night
              </ToggleGroupItem>
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>

        <Separator className="my-4" />

        {/* Session Type */}
        <AccordionItem value="session-type">
          <AccordionTrigger className="text-base font-semibold text-on-surface">Session Type</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <ToggleGroup
              type="single"
              value={sessionType || ''}
              onValueChange={(value) => setSessionType(value as '1-on-1' | 'group' || null)}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem value="1-on-1" aria-label="1-on-1 Session" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                1-on-1 Session
              </ToggleGroupItem>
              <ToggleGroupItem value="group" aria-label="Group Session" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Group Session
              </ToggleGroupItem>
            </ToggleGroup>
            {sessionType === 'group' && (
              <div className="mt-4">
                <Label className="block text-sm font-medium text-on-surface mb-2">Group Size</Label>
                <ToggleGroup
                  type="single"
                  value={groupSize || ''}
                  onValueChange={(value) => setGroupSize(value || null)}
                  className="grid grid-cols-2 gap-2"
                >
                  <ToggleGroupItem value="2-5" aria-label="2-5 students" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                    2-5 Students
                  </ToggleGroupItem>
                  <ToggleGroupItem value="6-10" aria-label="6-10 students" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                    6-10 Students
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <Separator className="my-4" />

        {/* Mentor Features */}
        <AccordionItem value="mentor-features">
          <AccordionTrigger className="text-base font-semibold text-on-surface">Mentor Features</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {[
              'Screen Share',
              'Homework Help',
              'Interview Prep',
              'Exam Focused',
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature.toLowerCase().replace(/\s/g, '-')}`}
                  checked={mentorFeatures.includes(feature)}
                  onCheckedChange={(checked) => handleMentorFeatureChange(feature, checked as boolean)}
                />
                <Label htmlFor={`feature-${feature.toLowerCase().replace(/\s/g, '-')}`} className="text-on-surface-variant">
                  {feature}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <Separator className="my-4" />

        {/* Experience Level */}
        <AccordionItem value="experience-level">
          <AccordionTrigger className="text-base font-semibold text-on-surface">Experience Level</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            <ToggleGroup
              type="single"
              value={experienceLevel || ''}
              onValueChange={(value) => setExperienceLevel(value || null)}
              className="grid grid-cols-1 gap-2"
            >
              <ToggleGroupItem value="student" aria-label="Student" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Student
              </ToggleGroupItem>
              <ToggleGroupItem value="professional" aria-label="Professional" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Professional
              </ToggleGroupItem>
              <ToggleGroupItem value="expert" aria-label="Expert" className={`data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container`}>
                Expert
              </ToggleGroupItem>
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={applyFilters} className="w-full mt-6" variant="default">
        Apply Filters
      </Button>
    </div>
  );
}
