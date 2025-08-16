import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Star,
  Bell,
  PlusCircle,
  CalendarDays,
  MessageSquare,
  User,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  Download,
  ArrowRight,
  BarChart2,
  Clock,
  RefreshCcw,
  Calendar,
  Mail,
  Wallet,
  Settings,
} from 'lucide-react';
import { MOCK_MENTORS, Mentor, Course } from '@/data/mentors';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils'; // Import cn for conditional class names

// Mock data for the dashboard
const CURRENT_MENTOR_ID = 'mentor-1'; // Assuming Dr. Anya Sharma is the logged-in mentor
const CURRENT_MENTOR: Mentor | undefined = MOCK_MENTORS.find(m => m.id === CURRENT_MENTOR_ID);

const MOCK_EARNINGS_DATA = [
  { month: 'Jan', earnings: 12000 },
  { month: 'Feb', earnings: 15000 },
  { month: 'Mar', earnings: 13500 },
  { month: 'Apr', earnings: 18000 },
  { month: 'May', earnings: 16500 },
  { month: 'Jun', earnings: 20000 },
];

const MOCK_SESSIONS = [
  { id: 's1', studentName: 'Priya K.', subject: 'Python', date: '2024-07-25', time: '10:00 AM', duration: 60, status: 'Upcoming', earnings: 1500 },
  { id: 's2', studentName: 'Ankit S.', subject: 'Machine Learning', date: '2024-07-24', time: '02:00 PM', duration: 90, status: 'Completed', earnings: 2250 },
  { id: 's3', studentName: 'Rahul V.', subject: 'Data Science', date: '2024-07-23', time: '04:00 PM', duration: 60, status: 'Completed', earnings: 1500 },
  { id: 's4', studentName: 'Sneha G.', subject: 'Python', date: '2024-07-22', time: '11:00 AM', duration: 30, status: 'Cancelled', earnings: 0 },
  { id: 's5', studentName: 'Vikram M.', subject: 'Machine Learning', date: '2024-07-26', time: '03:00 PM', duration: 60, status: 'Upcoming', earnings: 1500 },
];

const MOCK_RATING_TRENDS = [
  { month: 'Jan', rating: 4.5 },
  { month: 'Feb', rating: 4.6 },
  { month: 'Mar', rating: 4.7 },
  { month: 'Apr', rating: 4.8 },
  { month: 'May', rating: 4.9 },
  { month: 'Jun', rating: 4.9 },
];

const MOCK_MESSAGES = [
  { id: 'm1', sender: 'Priya K.', subject: 'Question about next session', preview: 'Hi Dr. Sharma, I was wondering if we could...', unread: true },
  { id: 'm2', sender: 'StudyBuddy Support', subject: 'New feature update!', preview: 'Exciting news! We have launched a new...', unread: false },
  { id: 'm3', sender: 'Ankit S.', subject: 'Feedback on ML course', preview: 'The Machine Learning course was fantastic...', unread: true },
];

// Helper function for date comparison (addDays was missing)
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export function MentorDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchSession, setSearchSession] = useState('');
  const [filterSessionStatus, setFilterSessionStatus] = useState('all');

  if (!CURRENT_MENTOR) {
    return (
      <div className="container mx-auto py-12 text-center text-muted-foreground">
        <h2 className="text-2xl font-bold">Mentor Profile Not Found</h2>
        <p className="mt-2">Please ensure you are logged in as a mentor.</p>
        <Link to="/">
          <Button className="mt-6">Go to Home</Button>
        </Link>
      </div>
    );
  }

  const totalEarningsThisMonth = MOCK_EARNINGS_DATA[MOCK_EARNINGS_DATA.length - 1]?.earnings || 0;
  const lastMonthEarnings = MOCK_EARNINGS_DATA[MOCK_EARNINGS_DATA.length - 2]?.earnings || 0;
  const earningsChange = lastMonthEarnings > 0 ? ((totalEarningsThisMonth - lastMonthEarnings) / lastMonthEarnings) * 100 : 0;

  const sessionsThisWeek = MOCK_SESSIONS.filter(s => s.status === 'Upcoming' && new Date(s.date) <= addDays(new Date(), 7)).length;
  const totalStudents = CURRENT_MENTOR.studentsTaught || 0;
  const averageRating = CURRENT_MENTOR.rating;

  const filteredSessions = MOCK_SESSIONS.filter(session => {
    const matchesSearch = session.studentName.toLowerCase().includes(searchSession.toLowerCase()) ||
                          session.subject.toLowerCase().includes(searchSession.toLowerCase());
    const matchesStatus = filterSessionStatus === 'all' || session.status.toLowerCase() === filterSessionStatus;
    return matchesSearch && matchesStatus;
  });

  const chartConfig = {
    earnings: {
      label: 'Earnings',
      color: 'hsl(var(--primary))', // Uses the new primary color
    },
  };

  const ratingChartConfig = {
    rating: {
      label: 'Rating',
      color: 'hsl(var(--accent))',
    },
  };

  const profileCompletion = 75; // Mock value

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 font-bold text-primary text-lg mb-8">
          <BookOpen className="h-6 w-6" />
          StudyBuddy
        </div>
        <nav className="flex-1 space-y-2">
          <Button
            className={cn(
              "w-full justify-start",
              activeTab === 'overview'
                ? 'bg-surface text-primary hover:bg-surface/90' // Active state: Surface background, Primary text
                : 'text-on-surface-variant hover:bg-muted' // Inactive state: On Surface Variant text, Muted hover
            )}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button
            className={cn(
              "w-full justify-start",
              activeTab === 'sessions'
                ? 'bg-surface text-primary hover:bg-surface/90'
                : 'text-on-surface-variant hover:bg-muted'
            )}
            onClick={() => setActiveTab('sessions')}
          >
            <CalendarDays className="mr-2 h-4 w-4" /> My Sessions
          </Button>
          <Button
            className={cn(
              "w-full justify-start",
              activeTab === 'courses'
                ? 'bg-surface text-primary hover:bg-surface/90'
                : 'text-on-surface-variant hover:bg-muted'
            )}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen className="mr-2 h-4 w-4" /> Course Management
          </Button>
          <Button
            className={cn(
              "w-full justify-start",
              activeTab === 'messages'
                ? 'bg-surface text-primary hover:bg-surface/90'
                : 'text-on-surface-variant hover:bg-muted'
            )}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Messages
            {MOCK_MESSAGES.filter(m => m.unread).length > 0 && (
              <Badge className="ml-auto bg-primary text-primary-foreground">{MOCK_MESSAGES.filter(m => m.unread).length}</Badge>
            )}
          </Button>
          <Button
            className={cn(
              "w-full justify-start",
              activeTab === 'profile'
                ? 'bg-surface text-primary hover:bg-surface/90'
                : 'text-on-surface-variant hover:bg-muted'
            )}
            onClick={() => setActiveTab('profile')}
          >
            <User className="mr-2 h-4 w-4" /> Profile Settings
          </Button>
          <Button
            className={cn(
              "w-full justify-start",
              activeTab === 'earnings'
                ? 'bg-surface text-primary hover:bg-surface/90'
                : 'text-on-surface-variant hover:bg-muted'
            )}
            onClick={() => setActiveTab('earnings')}
          >
            <DollarSign className="mr-2 h-4 w-4" /> Earnings
          </Button>
        </nav>
        <div className="mt-auto space-y-2">
          <Progress value={profileCompletion} className="w-full h-2 mb-2" />
          <p className="text-sm text-muted-foreground text-center">Profile Completion: {profileCompletion}%</p>
          <Button variant="outline" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> Account Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 md:p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Welcome, {CURRENT_MENTOR.name.split(' ')[0]}!</h1>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  {MOCK_MESSAGES.filter(m => m.unread).length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <h4 className="font-semibold mb-2 text-on-surface">Notifications</h4>
                {MOCK_MESSAGES.filter(m => m.unread).length > 0 ? (
                  <ul className="space-y-2">
                    {MOCK_MESSAGES.filter(m => m.unread).map(msg => (
                      <li key={msg.id} className="text-sm text-on-surface-variant">
                        <Link to="/mentor-dashboard?tab=messages" className="hover:underline">
                          <span className="font-medium text-on-surface">{msg.sender}:</span> {msg.preview}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-on-surface-variant">No new notifications.</p>
                )}
              </PopoverContent>
            </Popover>
            <Avatar className="h-9 w-9">
              <AvatarImage src={CURRENT_MENTOR.profilePhoto} alt={CURRENT_MENTOR.name} />
              <AvatarFallback>{CURRENT_MENTOR.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-on-surface-variant">Current Month Earnings</p>
                <h2 className="text-2xl font-bold text-on-surface">₹{totalEarningsThisMonth.toLocaleString()}</h2>
                <p className={`text-xs ${earningsChange >= 0 ? 'text-secondary-on-container' : 'text-destructive'}`}>
                  {earningsChange >= 0 ? '↑' : '↓'} {Math.abs(earningsChange).toFixed(1)}% vs last month
                </p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <CalendarDays className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-sm text-on-surface-variant">Sessions This Week</p>
                <h2 className="text-2xl font-bold text-on-surface">{sessionsThisWeek}</h2>
                <p className="text-xs text-on-surface-variant">Upcoming sessions</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-on-surface-variant">Total Students</p>
                <h2 className="text-2xl font-bold text-on-surface">{totalStudents}</h2>
                <p className="text-xs text-on-surface-variant">Students taught so far</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <Star className="h-8 w-8 text-highlight-yellow" />
              <div>
                <p className="text-sm text-on-surface-variant">Average Rating</p>
                <h2 className="text-2xl font-bold text-on-surface">{averageRating.toFixed(1)}</h2>
                <p className="text-xs text-on-surface-variant">Based on {CURRENT_MENTOR.reviewCount} reviews</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions Panel */}
          <Card className="p-6 mb-8 shadow-lg">
            <CardTitle className="text-xl font-bold text-on-surface mb-4">Quick Actions</CardTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Link to="/mentor/create-course">
                <Button className="w-full h-24 flex flex-col items-center justify-center text-center">
                  <PlusCircle className="h-6 w-6 mb-2" />
                  Create New Course
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center">
                <CalendarDays className="h-6 w-6 mb-2" />
                View My Schedule
              </Button>
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-6 w-6 mb-2" />
                Check Messages
              </Button>
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center">
                <Wallet className="h-6 w-6 mb-2" />
                Withdraw Earnings
              </Button>
              <Link to={`/mentors/${CURRENT_MENTOR.id}`}>
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center">
                  <User className="h-6 w-6 mb-2" />
                  View Public Profile
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-center">
                <Settings className="h-6 w-6 mb-2" />
                Update Profile
              </Button>
            </div>
          </Card>

          {/* Earnings Overview Widget */}
          <Card className="p-6 mb-8 shadow-lg">
            <CardTitle className="text-xl font-bold text-on-surface mb-4">Earnings Overview</CardTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-on-surface-variant mb-2">Current Month Progress</p>
                <Progress value={(totalEarningsThisMonth / 25000) * 100} className="h-3 mb-4" />
                <p className="text-sm text-on-surface-variant">Target: ₹25,000</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">1-on-1 Sessions:</span>
                    <span className="font-semibold text-on-surface">₹{(totalEarningsThisMonth * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Group Sessions:</span>
                    <span className="font-semibold text-on-surface">₹{(totalEarningsThisMonth * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Pending Earnings:</span>
                    <span className="font-semibold text-warning">₹5,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Completed Earnings:</span>
                    <span className="font-semibold text-success">₹15,000</span>
                  </div>
                </div>
              </div>
              <div>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={MOCK_EARNINGS_DATA}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="earnings" fill="var(--color-earnings)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </Card>

          {/* Recent Sessions Table */}
          <Card className="p-6 mb-8 shadow-lg">
            <CardTitle className="text-xl font-bold text-on-surface mb-4">Recent Sessions</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <Input
                placeholder="Search sessions..."
                value={searchSession}
                onChange={(e) => setSearchSession(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterSessionStatus} onValueChange={setFilterSessionStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="ml-auto">
                <Download className="mr-2 h-4 w-4" /> Export to CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-on-surface-variant">Student Name</TableHead>
                    <TableHead className="text-on-surface-variant">Subject</TableHead>
                    <TableHead className="text-on-surface-variant">Date/Time</TableHead>
                    <TableHead className="text-on-surface-variant">Duration</TableHead>
                    <TableHead className="text-on-surface-variant">Status</TableHead>
                    <TableHead className="text-right text-on-surface-variant">Earnings</TableHead>
                    <TableHead className="text-center text-on-surface-variant">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium text-on-surface">{session.studentName}</TableCell>
                        <TableCell className="text-on-surface">{session.subject}</TableCell>
                        <TableCell className="text-on-surface">{session.date} at {session.time}</TableCell>
                        <TableCell className="text-on-surface">{session.duration} min</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              session.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : session.status === 'Upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-on-surface">₹{session.earnings.toLocaleString()}</TableCell>
                        <TableCell className="flex justify-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          {session.status === 'Upcoming' && (
                            <Button variant="outline" size="sm">
                              <RefreshCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-on-surface-variant py-8">
                        No sessions found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Performance Analytics */}
          <Card className="p-6 mb-8 shadow-lg">
            <CardTitle className="text-xl font-bold text-on-surface mb-4">Performance Analytics</CardTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-on-surface mb-3">Rating Trends</h3>
                <ChartContainer config={ratingChartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={MOCK_RATING_TRENDS}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      domain={[4, 5]}
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="rating" fill="var(--color-rating)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-on-surface mb-3">Key Metrics</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Session Completion Rate:</span>
                  <span className="font-semibold text-on-surface">95%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Student Retention Rate:</span>
                  <span className="font-semibold text-on-surface">80%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Booking Conversion Rate (Profile Views to Bookings):</span>
                  <span className="font-semibold text-on-surface">12%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Most Popular Subject:</span>
                  <span className="font-semibold text-on-surface">Machine Learning</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Most Popular Time Slot:</span>
                  <span className="font-semibold text-on-surface">Evenings (6-8 PM)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Course Management Section */}
          <Card className="p-6 mb-8 shadow-lg">
            <CardTitle className="text-xl font-bold text-on-surface mb-4">My Courses</CardTitle>
            {CURRENT_MENTOR.courses && CURRENT_MENTOR.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CURRENT_MENTOR.courses.map((course) => (
                  <Card key={course.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                    <CardTitle className="text-lg font-bold text-on-surface mb-2">{course.title}</CardTitle>
                    <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-on-surface-variant mb-3">
                      <span>Duration: {course.duration}</span>
                      <Badge variant="outline">{course.difficulty}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-bold text-primary">
                        ₹{course.price}
                        <span className="text-sm text-on-surface-variant"> ({course.price} coins)</span>
                      </div>
                      <Badge variant="secondary">{course.sessionType} Session</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-on-surface-variant mb-4">
                      <span>Bookings: {course.bookingCount || 0}</span>
                      <span>Rating: {course.rating?.toFixed(1) || 'N/A'} ({course.reviews || 0})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-grow">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-on-surface-variant">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                <p className="text-lg">You haven't created any courses yet.</p>
                <Link to="/mentor/create-course">
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Course
                  </Button>
                </Link>
              </div>
            )}
            {CURRENT_MENTOR.courses && CURRENT_MENTOR.courses.length > 0 && (
              <div className="flex justify-end mt-6">
                <Link to="/mentor/create-course">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Calendar Integration */}
          <Card className="p-6 mb-8 shadow-lg">
            <CardTitle className="text-xl font-bold text-on-surface mb-4">My Calendar</CardTitle>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <Calendar
                  mode="single"
                  selected={new Date()} // Highlight today
                  className="rounded-md border shadow"
                />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-lg font-semibold text-on-surface">Upcoming Sessions</h3>
                {MOCK_SESSIONS.filter(s => s.status === 'Upcoming').length > 0 ? (
                  <ul className="space-y-2">
                    {MOCK_SESSIONS.filter(s => s.status === 'Upcoming').map(session => (
                      <li key={session.id} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>{session.date} - {session.time} with {session.studentName} ({session.subject})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-on-surface-variant">No upcoming sessions.</p>
                )}
                <Separator />
                <h3 className="text-lg font-semibold text-on-surface">Availability Quick Toggle</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="availability-toggle" className="text-on-surface-variant">Set myself as Available</Label>
                  <Switch id="availability-toggle" defaultChecked />
                </div>
                <Button variant="outline" className="w-full">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Sync with Google Calendar
                </Button>
              </div>
            </div>
          </Card>

          {/* Student Messages */}
          <Card className="p-6 mb-8 shadow-lg">
            <CardTitle className="text-xl font-bold text-on-surface mb-4">Student Messages</CardTitle>
            {MOCK_MESSAGES.length > 0 ? (
              <div className="space-y-4">
                {MOCK_MESSAGES.map(message => (
                  <div key={message.id} className="flex items-center gap-4 p-3 border rounded-md hover:bg-primary-container/20 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-on-surface">{message.sender}</p>
                        {message.unread && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                      </div>
                      <p className="text-sm text-on-surface-variant line-clamp-1">{message.subject}: {message.preview}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-on-surface-variant">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                <p className="text-lg">No messages yet.</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-6">
              View All Messages
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
