import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar } from '@/components/ui/calendar';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Save,
  BookOpen,
  DollarSign,
  CalendarDays,
  List,
  Eye,
  Lightbulb,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SUBJECT_CATEGORIES } from '@/data/subjects';
import { format } from 'date-fns';

export function CourseCreationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    title: '',
    subjectCategory: '',
    description: '',
    difficulty: '',
    duration: '',
    prerequisites: '',
    sessionType: '1-on-1',
    maxParticipants: '',
    groupDynamics: '',
    materialsNeeded: [],
    equipmentRequirements: '',
    price: '',
    bulkDiscounts: [],
    availabilityType: 'recurring',
    recurringSlots: [],
    oneTimeSessions: [],
    blackoutDates: [],
    learningObjectives: [],
    sessionOutline: '',
    downloadableResources: [],
    homeworkTemplates: [],
    assessmentCriteria: '',
    publishNow: true,
    schedulePublishDate: '',
    seoKeywords: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev: any) => ({ ...prev, [id]: checked }));
    } else if (type === 'file') {
      setFormData((prev: any) => ({ ...prev, [id]: e.target.files ? Array.from(e.target.files) : null }));
    } else {
      setFormData((prev: any) => ({ ...prev, [id]: value }));
    }
    setFormErrors((prev: any) => ({ ...prev, [id]: '' }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
    setFormErrors((prev: any) => ({ ...prev, [id]: '' }));
  };

  const handleMultiSelectChange = (id: string, value: string, checked: boolean) => {
    setFormData((prev: any) => {
      const currentArray = prev[id] || [];
      return {
        ...prev,
        [id]: checked ? [...currentArray, value] : currentArray.filter((item: string) => item !== value),
      };
    });
    setFormErrors((prev: any) => ({ ...prev, [id]: '' }));
  };

  const handleDynamicListChange = (listName: string, index: number, value: string) => {
    setFormData((prev: any) => {
      const newList = [...prev[listName]];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const addDynamicListItem = (listName: string, defaultValue: any = '') => {
    setFormData((prev: any) => ({
      ...prev,
      [listName]: [...prev[listName], defaultValue],
    }));
  };

  const removeDynamicListItem = (listName: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [listName]: prev[listName].filter((_: any, i: number) => i !== index),
    }));
  };

  const validateStep = () => {
    let errors: any = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.title) errors.title = 'Course title is required.';
      if (!formData.subjectCategory) errors.subjectCategory = 'Subject category is required.';
      if (!formData.description || formData.description.length < 50) errors.description = 'Description is required and must be at least 50 characters.';
      if (!formData.difficulty) errors.difficulty = 'Difficulty level is required.';
      if (!formData.duration) errors.duration = 'Duration is required.';
    } else if (step === 2) {
      if (formData.sessionType === 'group' && (!formData.maxParticipants || parseInt(formData.maxParticipants) < 2)) {
        errors.maxParticipants = 'Maximum participants is required for group sessions (min 2).';
      }
    } else if (step === 3) {
      if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Price must be a positive number.';
      if (formData.availabilityType === 'recurring' && formData.recurringSlots.length === 0) {
        errors.recurringSlots = 'At least one recurring slot is required.';
      }
      if (formData.availabilityType === 'one-time' && formData.oneTimeSessions.length === 0) {
        errors.oneTimeSessions = 'At least one one-time session is required.';
      }
    } else if (step === 4) {
      if (formData.learningObjectives.length === 0 || formData.learningObjectives.some((obj: string) => !obj.trim())) {
        errors.learningObjectives = 'At least one learning objective is required.';
      }
      if (!formData.sessionOutline) errors.sessionOutline = 'Session outline/curriculum is required.';
    }

    setFormErrors(errors);
    isValid = Object.keys(errors).length === 0;
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive',
      });
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handlePublish = () => {
    if (validateStep()) { // Validate final step
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        toast({
          title: 'Course Published!',
          description: `Your course "${formData.title}" has been successfully published.`,
          variant: 'default',
        });
        console.log('Course Data:', formData);
        // Redirect to mentor dashboard or course list
        // navigate('/mentor-dashboard?tab=courses');
        setStep(6); // Move to success state
      }, 2000);
    }
  };

  const aiPriceRecommendation = useMemo(() => {
    // Simple mock AI logic
    const basePrice = formData.duration === '30min' ? 300 :
                      formData.duration === '1hr' ? 500 :
                      formData.duration === '1.5hr' ? 750 :
                      formData.duration === '2hr' ? 1000 : 0;
    const difficultyFactor = formData.difficulty === 'Beginner' ? 1 :
                             formData.difficulty === 'Intermediate' ? 1.2 :
                             formData.difficulty === 'Advanced' ? 1.5 : 1;
    const recommended = basePrice * difficultyFactor;
    return {
      recommended: recommended,
      range: [recommended * 0.8, recommended * 1.2],
      reasoning: `Based on similar ${formData.subjectCategory} courses and ${formData.duration} duration.`,
    };
  }, [formData.subjectCategory, formData.duration, formData.difficulty]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> 1. Basic Information
            </h3>
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Master React Hooks" maxLength={100} />
              <p className="text-xs text-muted-foreground text-right">
                {formData.title.length}/100 characters
              </p>
              {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
            </div>
            <div>
              <Label htmlFor="subjectCategory">Subject Category</Label>
              <Select value={formData.subjectCategory} onValueChange={(value) => handleSelectChange('subjectCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a main category" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.subjectCategory && <p className="text-red-500 text-xs mt-1">{formErrors.subjectCategory}</p>}
            </div>
            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of your course, what learners will gain, etc. (Min 50 characters)"
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/1000 characters
              </p>
              {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.difficulty && <p className="text-red-500 text-xs mt-1">{formErrors.difficulty}</p>}
              </div>
              <div>
                <Label htmlFor="duration">Duration per Session</Label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hr">1 hour</SelectItem>
                    <SelectItem value="1.5hr">1.5 hours</SelectItem>
                    <SelectItem value="2hr">2 hours</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.duration && <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
              <Textarea
                id="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                placeholder="e.g., Basic understanding of JavaScript, High school math"
                rows={3}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <List className="h-5 w-5" /> 2. Session Details
            </h3>
            <div>
              <Label className="mb-2 block">Session Type</Label>
              <ToggleGroup
                type="single"
                value={formData.sessionType}
                onValueChange={(value: '1-on-1' | 'group') => handleSelectChange('sessionType', value)}
                className="grid grid-cols-2 gap-4"
              >
                <ToggleGroupItem value="1-on-1" aria-label="1-on-1 Session">
                  1-on-1 Session
                </ToggleGroupItem>
                <ToggleGroupItem value="group" aria-label="Group Session">
                  Group Session
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {formData.sessionType === 'group' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="maxParticipants">Maximum Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    min={2}
                    max={10}
                  />
                  {formErrors.maxParticipants && <p className="text-red-500 text-xs mt-1">{formErrors.maxParticipants}</p>}
                </div>
                <div>
                  <Label htmlFor="groupDynamics">Group Dynamics Description (Optional)</Label>
                  <Textarea
                    id="groupDynamics"
                    value={formData.groupDynamics}
                    onChange={handleInputChange}
                    placeholder="Describe how group sessions will be conducted, e.g., 'Interactive discussions, pair programming'"
                    rows={3}
                  />
                </div>
              </div>
            )}
            <div>
              <Label className="mb-2 block">Materials Needed (Check all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Textbook',
                  'Notebook & Pen',
                  'Specific Software',
                  'Online Resources',
                  'Headphones',
                ].map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={`material-${material.toLowerCase().replace(/\s/g, '-')}`}
                      checked={formData.materialsNeeded.includes(material)}
                      onCheckedChange={(checked) => handleMultiSelectChange('materialsNeeded', material, checked as boolean)}
                    />
                    <Label htmlFor={`material-${material.toLowerCase().replace(/\s/g, '-')}`}>
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="equipmentRequirements">Equipment Requirements (e.g., Webcam, Mic, Specific Software)</Label>
              <Textarea
                id="equipmentRequirements"
                value={formData.equipmentRequirements}
                onChange={handleInputChange}
                placeholder="e.g., 'Stable internet connection, working webcam and microphone, VS Code installed'"
                rows={3}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> 3. Pricing & Availability
            </h3>
            <Card className="p-4 bg-blue-50 border-blue-200 text-blue-800">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5" /> AI-Powered Price Recommendation
              </h4>
              <p className="text-sm">
                Recommended: <span className="font-bold text-lg">₹{aiPriceRecommendation.recommended.toFixed(0)}</span> / hour
              </p>
              <p className="text-xs text-muted-foreground">
                Range: ₹{aiPriceRecommendation.range[0].toFixed(0)} - ₹{aiPriceRecommendation.range[1].toFixed(0)} / hour
              </p>
              <p className="text-xs text-muted-foreground mt-1">{aiPriceRecommendation.reasoning}</p>
            </Card>
            <div>
              <Label htmlFor="price">Price per Session (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 750"
                min={50}
              />
              {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
            </div>
            <div>
              <Label className="mb-2 block">Bulk Session Discounts (Optional)</Label>
              {formData.bulkDiscounts.map((discount: { sessions: number; percentage: number }, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    type="number"
                    placeholder="Sessions (e.g., 5)"
                    value={discount.sessions}
                    onChange={(e) => handleDynamicListChange('bulkDiscounts', index, { ...discount, sessions: parseInt(e.target.value) || 0 })}
                    className="w-32"
                  />
                  <Input
                    type="number"
                    placeholder="Discount % (e.g., 10)"
                    value={discount.percentage}
                    onChange={(e) => handleDynamicListChange('bulkDiscounts', index, { ...discount, percentage: parseInt(e.target.value) || 0 })}
                    className="w-32"
                  />
                  <Button variant="outline" size="icon" onClick={() => removeDynamicListItem('bulkDiscounts', index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addDynamicListItem('bulkDiscounts', { sessions: 0, percentage: 0 })} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Discount
              </Button>
            </div>
            <Separator className="my-6" />
            <div>
              <Label className="mb-2 block">Availability Scheduler</Label>
              <ToggleGroup
                type="single"
                value={formData.availabilityType}
                onValueChange={(value: 'recurring' | 'one-time') => handleSelectChange('availabilityType', value)}
                className="grid grid-cols-2 gap-4 mb-4"
              >
                <ToggleGroupItem value="recurring">Weekly Recurring Slots</ToggleGroupItem>
                <ToggleGroupItem value="one-time">One-Time Sessions</ToggleGroupItem>
              </ToggleGroup>

              {formData.availabilityType === 'recurring' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Define your regular weekly availability.</p>
                  {formData.recurringSlots.map((slot: { day: string; time: string }, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={slot.day}
                        onValueChange={(value) => handleDynamicListChange('recurringSlots', index, { ...slot, day: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="time"
                        value={slot.time}
                        onChange={(e) => handleDynamicListChange('recurringSlots', index, { ...slot, time: e.target.value })}
                        className="w-32"
                      />
                      <Button variant="outline" size="icon" onClick={() => removeDynamicListItem('recurringSlots', index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => addDynamicListItem('recurringSlots', { day: '', time: '' })} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Recurring Slot
                  </Button>
                  {formErrors.recurringSlots && <p className="text-red-500 text-xs mt-1">{formErrors.recurringSlots}</p>}
                </div>
              )}

              {formData.availabilityType === 'one-time' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Add specific dates and times for one-off sessions.</p>
                  {formData.oneTimeSessions.map((session: { date: Date | undefined; time: string }, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Calendar
                        mode="single"
                        selected={session.date}
                        onSelect={(date) => handleDynamicListChange('oneTimeSessions', index, { ...session, date })}
                        className="rounded-md border"
                      />
                      <Input
                        type="time"
                        value={session.time}
                        onChange={(e) => handleDynamicListChange('oneTimeSessions', index, { ...session, time: e.target.value })}
                        className="w-32"
                      />
                      <Button variant="outline" size="icon" onClick={() => removeDynamicListItem('oneTimeSessions', index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => addDynamicListItem('oneTimeSessions', { date: undefined, time: '' })} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add One-Time Session
                  </Button>
                  {formErrors.oneTimeSessions && <p className="text-red-500 text-xs mt-1">{formErrors.oneTimeSessions}</p>}
                </div>
              )}

              <div className="mt-6">
                <Label className="mb-2 block">Blackout Dates (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">Select dates when you are unavailable.</p>
                <Calendar
                  mode="multiple"
                  selected={formData.blackoutDates}
                  onSelect={(dates) => setFormData((prev: any) => ({ ...prev, blackoutDates: dates }))}
                  className="rounded-md border shadow"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> 4. Course Content
            </h3>
            <div>
              <Label className="mb-2 block">Learning Objectives (What will learners achieve?)</Label>
              {formData.learningObjectives.map((objective: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={objective}
                    onChange={(e) => handleDynamicListChange('learningObjectives', index, e.target.value)}
                    placeholder={`Objective ${index + 1}`}
                  />
                  <Button variant="outline" size="icon" onClick={() => removeDynamicListItem('learningObjectives', index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addDynamicListItem('learningObjectives', '')} className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Objective
              </Button>
              {formErrors.learningObjectives && <p className="text-red-500 text-xs mt-1">{formErrors.learningObjectives}</p>}
            </div>
            <div>
              <Label htmlFor="sessionOutline">Session Outline / Curriculum</Label>
              <Textarea
                id="sessionOutline"
                value={formData.sessionOutline}
                onChange={handleInputChange}
                placeholder="Provide a detailed outline of each session or the overall curriculum."
                rows={8}
              />
              {formErrors.sessionOutline && <p className="text-red-500 text-xs mt-1">{formErrors.sessionOutline}</p>}
            </div>
            <div>
              <Label htmlFor="downloadableResources">Downloadable Resources (e.g., PDFs, code samples)</Label>
              <Input id="downloadableResources" type="file" multiple onChange={handleInputChange} />
              {formData.downloadableResources && formData.downloadableResources.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {formData.downloadableResources.map((f: File) => f.name).join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="homeworkTemplates">Homework/Assignment Templates (Optional)</Label>
              <Input id="homeworkTemplates" type="file" multiple onChange={handleInputChange} />
              {formData.homeworkTemplates && formData.homeworkTemplates.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {formData.homeworkTemplates.map((f: File) => f.name).join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="assessmentCriteria">Assessment Criteria (Optional)</Label>
              <Textarea
                id="assessmentCriteria"
                value={formData.assessmentCriteria}
                onChange={handleInputChange}
                placeholder="How will learner progress be assessed?"
                rows={3}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5" /> 5. Preview & Publish
            </h3>
            <p className="text-sm text-muted-foreground">
              Review how your course will appear to learners.
            </p>
            <Card className="p-6 shadow-lg bg-muted/10">
              <h4 className="text-lg font-bold mb-4">Course Listing Preview</h4>
              <div className="space-y-3">
                <p className="text-xl font-bold text-foreground">{formData.title || 'Untitled Course'}</p>
                <Badge variant="secondary">{formData.subjectCategory || 'Category'}</Badge>
                <p className="text-sm text-muted-foreground">{formData.description || 'No description provided.'}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Difficulty: <Badge variant="outline">{formData.difficulty || 'N/A'}</Badge></span>
                  <span>Duration: {formData.duration || 'N/A'}</span>
                  <span>Session Type: <Badge variant="outline">{formData.sessionType === '1-on-1' ? '1-on-1' : `Group (${formData.maxParticipants} max)`}</Badge></span>
                </div>
                <p className="text-2xl font-bold text-primary">₹{formData.price || '0'} <span className="text-base text-muted-foreground">/ session</span></p>
                {formData.learningObjectives.length > 0 && (
                  <div>
                    <p className="font-semibold text-foreground mt-4">What you'll learn:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {formData.learningObjectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)}
                    </ul>
                  </div>
                )}
                <Button variant="outline" className="mt-4">Simulate Student View</Button>
              </div>
            </Card>

            <Separator className="my-6" />

            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3">Publishing Options</h4>
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="publishNow"
                  checked={formData.publishNow}
                  onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, publishNow: checked }))}
                />
                <Label htmlFor="publishNow">Publish Immediately</Label>
              </div>
              {!formData.publishNow && (
                <div>
                  <Label htmlFor="schedulePublishDate">Schedule Publish Date</Label>
                  <Input
                    id="schedulePublishDate"
                    type="date"
                    value={formData.schedulePublishDate}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="seoKeywords">SEO Optimization Suggestions (Optional)</Label>
              <Textarea
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleInputChange}
                placeholder="Add keywords to help learners find your course (e.g., 'React tutorial', 'Python for beginners')"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Suggestions: Use relevant keywords, include your subject and target audience.
              </p>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <CheckCircle className="h-24 w-24 text-green-500 animate-bounce" />
            <h3 className="text-3xl font-bold text-foreground mt-6 mb-3">Course Created!</h3>
            <p className="text-lg text-muted-foreground max-w-md">
              Your course "<span className="font-semibold">{formData.title}</span>" has been successfully created and is now {formData.publishNow ? 'live' : `scheduled for ${format(new Date(formData.schedulePublishDate), 'PPP')}`}.
            </p>
            <Card className="p-6 mt-8 w-full max-w-md text-left shadow-lg">
              <CardTitle className="text-xl font-bold mb-4">Next Steps</CardTitle>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Share your course link with potential learners.</li>
                <li>Monitor your course performance from the dashboard.</li>
                <li>Update your availability to receive bookings.</li>
              </ul>
              <div className="flex flex-col gap-3 mt-6">
                <Link to="/mentor-dashboard?tab=courses" className="w-full">
                  <Button className="w-full">Go to My Courses</Button>
                </Link>
                <Link to="/mentor-dashboard?tab=sessions" className="w-full">
                  <Button variant="outline" className="w-full">
                    <CalendarDays className="mr-2 h-4 w-4" /> Update My Schedule
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="p-6 md:p-8 shadow-xl rounded-2xl">
        <CardHeader className="p-0 mb-6">
          {step < 6 && (
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1 || loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Progress value={((step - 1) / 4) * 100} className="w-1/2" />
              <span className="text-sm text-muted-foreground">Step {step} of 5</span>
            </div>
          )}
          <CardTitle className="text-3xl font-extrabold text-center text-primary">
            {step === 6 ? 'Course Creation Complete!' : 'Create New Course'}
          </CardTitle>
          {step < 6 && (
            <CardDescription className="text-center text-muted-foreground mt-2">
              Follow these steps to create and publish your course.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {renderStepContent()}
        </CardContent>
        {step < 6 && (
          <div className="flex justify-end mt-8 gap-4">
            <Button variant="outline" onClick={() => toast({ title: 'Draft Saved!', description: 'Your course progress has been saved.', variant: 'default' })}>
              <Save className="mr-2 h-4 w-4" /> Save as Draft
            </Button>
            {step < 5 ? (
              <Button onClick={handleNext} disabled={loading}>
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handlePublish} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    Publish Course <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
