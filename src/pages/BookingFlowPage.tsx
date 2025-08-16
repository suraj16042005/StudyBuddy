import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_MENTORS, Mentor } from '@/data/mentors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  Download,
  Mail,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { format, addDays, isSameDay, isBefore, startOfDay } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export function BookingFlowPage() {
  const { id } = useParams<{ id: string }>();
  const mentor: Mentor | undefined = MOCK_MENTORS.find((m) => m.id === id);

  const [isOpen, setIsOpen] = useState(true); // Control modal visibility
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState<'1-on-1' | 'group' | null>('1-on-1');
  const [duration, setDuration] = useState<number | null>(60); // in minutes
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [requirements, setRequirements] = useState('');
  const [preparationMaterials, setPreparationMaterials] = useState<File[]>([]);
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'coins' | 'buy-coins'>('coins');
  const [groupSize, setGroupSize] = useState<string | null>(null);

  const pricePerMinute = mentor ? mentor.pricePerHour / 60 : 0;
  const calculatedPrice = duration ? pricePerMinute * duration : 0;
  const coinEquivalent = calculatedPrice; // 1 INR = 1 Coin

  const availableDates = useMemo(() => {
    if (!mentor?.availability) return [];
    return mentor.availability.map(item => new Date(item.date));
  }, [mentor]);

  const availableTimeSlotsForSelectedDate = useMemo(() => {
    if (!selectedDate || !mentor?.availability) return [];
    const dayAvailability = mentor.availability.find(item =>
      isSameDay(new Date(item.date), selectedDate)
    );
    return dayAvailability ? dayAvailability.slots : [];
  }, [selectedDate, mentor]);

  const handleNext = () => {
    if (step === 1) {
      if (!sessionType || !duration) {
        toast({
          title: 'Missing Information',
          description: 'Please select session type and duration.',
          variant: 'destructive',
        });
        return;
      }
    }
    if (step === 2) {
      if (!selectedDate || !selectedTimeSlot) {
        toast({
          title: 'Missing Information',
          description: 'Please select a date and time slot.',
          variant: 'destructive',
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPreparationMaterials(Array.from(event.target.files));
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...learningObjectives];
    newObjectives[index] = value;
    setLearningObjectives(newObjectives);
  };

  const addObjective = () => {
    setLearningObjectives([...learningObjectives, '']);
  };

  const removeObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const handleConfirmBooking = () => {
    // Simulate booking process
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(5); // Move to success state
      toast({
        title: 'Booking Confirmed!',
        description: `Your session with ${mentor?.name} is booked for ${format(selectedDate!, 'PPP')} at ${selectedTimeSlot}.`,
        variant: 'default',
      });
    }, 1500);
  };

  const [loading, setLoading] = useState(false);

  if (!mentor) {
    return (
      <div className="container mx-auto py-12 text-center text-muted-foreground">
        <h2 className="text-2xl font-bold">Mentor Not Found</h2>
        <p className="mt-2">The mentor you are looking for does not exist.</p>
        <Link to="/learn">
          <Button className="mt-6">Back to Mentor Discovery</Button>
        </Link>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Session with {mentor.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mentor.profilePhoto} alt={mentor.name} />
                <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{mentor.name}</span>
              <Badge variant="secondary">{mentor.headline}</Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Progress value={(step / 4) * 100} className="w-full my-4" />
        <p className="text-sm text-muted-foreground text-center mb-4">Step {step} of 4</p>

        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          {/* Step 1: Session Type Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">1. Select Session Type & Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`p-4 cursor-pointer transition-all ${sessionType === '1-on-1' ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setSessionType('1-on-1')}
                >
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5" /> 1-on-1 Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-sm text-muted-foreground">
                    <p>Personalized learning experience with direct mentor interaction.</p>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">Recommended</Badge>
                  </CardContent>
                </Card>
                <Card
                  className={`p-4 cursor-pointer transition-all ${sessionType === 'group' ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setSessionType('group')}
                >
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5" /> Join Group Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-sm text-muted-foreground">
                    <p>Collaborative learning with other students. (Current participants: 3)</p>
                    {sessionType === 'group' && (
                      <div className="mt-3">
                        <Label htmlFor="group-size" className="mb-1 block">Group Size</Label>
                        <ToggleGroup
                          type="single"
                          value={groupSize || ''}
                          onValueChange={(value) => setGroupSize(value || null)}
                          className="grid grid-cols-2 gap-2"
                        >
                          <ToggleGroupItem value="2-5">2-5 Students</ToggleGroupItem>
                          <ToggleGroupItem value="6-10">6-10 Students</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Label htmlFor="duration" className="mb-2 block text-lg font-semibold">Select Duration</Label>
                <ToggleGroup
                  type="single"
                  value={duration?.toString() || ''}
                  onValueChange={(value) => setDuration(value ? parseInt(value) : null)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <ToggleGroupItem value="30">30 min</ToggleGroupItem>
                  <ToggleGroupItem value="60">60 min</ToggleGroupItem>
                  <ToggleGroupItem value="90">90 min</ToggleGroupItem>
                  <ToggleGroupItem value="120">120 min</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Card className="p-4 mt-6 bg-primary/10 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Estimated Price:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{calculatedPrice.toFixed(0)}
                    <span className="text-base text-muted-foreground"> ({coinEquivalent.toFixed(0)} coins)</span>
                  </span>
                </div>
                {duration && duration >= 90 && (
                  <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-800">
                    Discount applied for longer session!
                  </Badge>
                )}
              </Card>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">2. Choose Date & Time</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <Label htmlFor="date-picker" className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      isBefore(date, startOfDay(new Date())) ||
                      !availableDates.some(d => isSameDay(d, date))
                    }
                    initialFocus
                    className="rounded-md border shadow"
                  />
                </div>
                <div className="md:w-1/2">
                  <Label htmlFor="time-slots" className="mb-2 block">Available Time Slots (Your Timezone)</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border rounded-md">
                    {selectedDate && availableTimeSlotsForSelectedDate.length > 0 ? (
                      availableTimeSlotsForSelectedDate.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTimeSlot === slot ? 'default' : 'outline'}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className="relative"
                        >
                          {slot}
                          {slot === '10:00 AM' && <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs">Most Booked</Badge>}
                          {slot === '02:00 PM' && <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">Just Booked</Badge>}
                        </Button>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-muted-foreground">
                        {selectedDate ? 'No slots available for this date.' : 'Please select a date first.'}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Quick booking slots for next 3 days:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.from({ length: 3 }).map((_, i) => {
                        const date = addDays(new Date(), i);
                        const daySlots = mentor.availability?.find(item => isSameDay(new Date(item.date), date))?.slots || [];
                        return daySlots.length > 0 ? (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedTimeSlot(daySlots[0]); // Auto-select first available
                            }}
                          >
                            {format(date, 'MMM d')} ({daySlots.length} slots)
                          </Button>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Session Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">3. Session Details</h3>
              <div>
                <Label htmlFor="topic" className="mb-2 block">Topic/Subject</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic or subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentor.subjects.map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                    <SelectItem value="other">Other (specify below)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="requirements" className="mb-2 block">Special Requirements / Questions</Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g., 'I need help with dynamic programming problems', 'Please focus on React hooks'"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="materials" className="mb-2 block">Preparation Materials (Optional)</Label>
                <Input
                  id="materials"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="file:text-primary file:font-medium"
                />
                {preparationMaterials.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected files: {preparationMaterials.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Learning Objectives (What do you want to achieve?)</Label>
                {learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                    />
                    <Button variant="outline" size="icon" onClick={() => removeObjective(index)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addObjective} className="mt-2">
                  Add Objective
                </Button>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="add-to-calendar"
                  checked={addToCalendar}
                  onCheckedChange={setAddToCalendar}
                />
                <Label htmlFor="add-to-calendar">Add to my calendar</Label>
              </div>
            </div>
          )}

          {/* Step 4: Payment Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">4. Confirm & Pay</h3>
              <Card className="p-6 shadow-lg bg-primary/5">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mentor:</span>
                    <span className="font-semibold">{mentor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session Type:</span>
                    <span className="font-semibold">{sessionType === '1-on-1' ? '1-on-1 Session' : `Group Session (${groupSize})`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time:</span>
                    <span className="font-semibold">
                      {selectedDate ? format(selectedDate, 'PPP') : 'N/A'} at {selectedTimeSlot || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold">{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Topic:</span>
                    <span className="font-semibold">{topic || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary pt-4 border-t border-border mt-4">
                    <span>Total Price:</span>
                    <span>₹{calculatedPrice.toFixed(0)} ({coinEquivalent.toFixed(0)} coins)</span>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Label className="mb-2 block text-lg font-semibold">Payment Method</Label>
                <ToggleGroup
                  type="single"
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'coins' | 'buy-coins')}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <ToggleGroupItem value="coins" className="flex flex-col items-start h-auto py-4">
                    <DollarSign className="h-6 w-6 mb-2 text-green-500" />
                    <span className="font-semibold text-base">Use StudyBuddy Coins</span>
                    <span className="text-sm text-muted-foreground text-left">Current Balance: 5000 coins</span>
                    {coinEquivalent > 5000 && (
                      <Badge variant="destructive" className="mt-2">Insufficient Coins!</Badge>
                    )}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="buy-coins" className="flex flex-col items-start h-auto py-4">
                    <DollarSign className="h-6 w-6 mb-2 text-blue-500" />
                    <span className="font-semibold text-base">Buy Coins & Book</span>
                    <span className="text-sm text-muted-foreground text-left">Pay with UPI, Card, Net Banking</span>
                  </ToggleGroupItem>
                </ToggleGroup>
                {paymentMethod === 'coins' && coinEquivalent > 5000 && (
                  <p className="text-sm text-red-500 mt-2">
                    You have insufficient coins. Please select "Buy Coins & Book" or top up your balance.
                  </p>
                )}
              </div>

              <div className="mt-6 text-sm text-muted-foreground">
                By confirming, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                <Link to="/cancellation-policy" className="text-primary hover:underline">Cancellation Policy</Link>.
              </div>
            </div>
          )}

          {/* Step 5: Success State */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <CheckCircle className="h-24 w-24 text-green-500 animate-bounce" />
              <h3 className="text-3xl font-bold text-foreground mt-6 mb-3">Booking Confirmed!</h3>
              <p className="text-lg text-muted-foreground max-w-md">
                Your session with <span className="font-semibold">{mentor.name}</span> is successfully booked.
              </p>
              <Card className="p-6 mt-8 w-full max-w-md text-left shadow-lg">
                <CardTitle className="text-xl font-bold mb-4">Session Details</CardTitle>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Mentor:</span> {mentor.name}</p>
                  <p><span className="font-semibold">Date:</span> {selectedDate ? format(selectedDate, 'PPP') : 'N/A'}</p>
                  <p><span className="font-semibold">Time:</span> {selectedTimeSlot || 'N/A'}</p>
                  <p><span className="font-semibold">Duration:</span> {duration} minutes</p>
                  <p><span className="font-semibold">Topic:</span> {topic || 'Not specified'}</p>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Calendar Invite
                  </Button>
                  <Button variant="secondary" className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Message Mentor
                  </Button>
                  <Link to="/my-sessions" className="w-full">
                    <Button className="w-full">Go to My Sessions</Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Dialog Footer with Navigation Buttons */}
        {step < 5 && (
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            {step < 4 && (
              <Button onClick={handleNext} disabled={loading}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === 4 && (
              <Button
                onClick={handleConfirmBooking}
                disabled={loading || (paymentMethod === 'coins' && coinEquivalent > 5000)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
