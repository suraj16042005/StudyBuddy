import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_MENTORS, Mentor, Course, Review } from '@/data/mentors';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Heart,
  MessageSquare,
  Share2,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  CalendarDays,
  PlayCircle,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Award,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast'; // Corrected import path

export function MentorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const mentor: Mentor | undefined = MOCK_MENTORS.find((m) => m.id === id);
  const [activeTab, setActiveTab] = useState('about');
  const { toast } = useToast(); // Initialize useToast

  if (!mentor) {
    return (
      <div className="container mx-auto py-12 text-center text-muted-foreground">
        <h2 className="text-2xl font-bold">Mentor Not Found</h2>
        <p className="mt-2">The mentor you are looking for does not exist.</p>
        <Link to="/learn">
          <Button onClick={() => toast({ title: "Navigating Back", description: "Returning to mentor discovery.", duration: 2000 })}>Back to Mentor Discovery</Button>
        </Link>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < Math.floor(rating) ? 'fill-highlight-yellow text-highlight-yellow' : 'text-muted-foreground'
          }`}
        />
      );
    }
    return stars;
  };

  const getRatingDistribution = (reviews: Review[]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    const totalReviews = reviews.length;
    return Object.entries(distribution).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([star, count]) => ({
      star: parseInt(star),
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    }));
  };

  const ratingDistribution = getRatingDistribution(mentor.reviews || []);

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
            <BreadcrumbLink asChild>
              <Link to="/learn">Find a Mentor</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mentor.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Profile Header */}
      <div
        className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8 shadow-lg"
        style={{
          backgroundImage: `url(${mentor.coverPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Parallax effect
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <div className="absolute inset-0" style={{
          maskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'matrix\' values=\'0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'matrix\' values=\'0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          opacity: 0.1,
        }}></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative">
            <Avatar className="h-36 w-36 md:h-40 md:w-40 border-4 border-background shadow-xl">
              <AvatarImage src={mentor.profilePhoto} alt={mentor.name} />
              <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {mentor.verificationBadges?.includes('ID Verified') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CheckCircle className="absolute bottom-2 right-2 h-8 w-8 text-primary fill-primary bg-background rounded-full border-2 border-background" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ID Verified</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {mentor.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">{mentor.headline}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <div className="flex">{renderStars(mentor.rating)}</div>
              <span className="text-xl font-semibold text-foreground">{mentor.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({mentor.reviewCount} reviews)</span>
              {mentor.isAvailableNow && (
                <Badge className="ml-4 bg-success hover:bg-success/90 text-white">
                  Available Now
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
              {mentor.languages.map((lang) => (
                <Badge key={lang.name} variant="secondary" className="flex items-center gap-1">
                  {lang.icon} {lang.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary">{mentor.totalSessions || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary">{mentor.responseTime || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Response Time</p>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary">{mentor.studentsTaught || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Students Taught</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Left Column (40%) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Demo Video Section */}
          {mentor.demoVideoUrl && (
            <Card className="p-4 shadow-lg">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold">Demo Video</CardTitle>
              </CardHeader>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={mentor.demoVideoUrl}
                  title="Mentor Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Watch a quick introduction from {mentor.name}.</p>
            </Card>
          )}

          {/* Quick Actions Panel */}
          <Card className="p-4 shadow-lg">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-3">
              <Button className="w-full py-3 text-lg font-semibold" onClick={() => toast({ title: "Booking Session", description: `Initiating booking for ${mentor.name}.`, duration: 2000 })}>
                <CalendarDays className="mr-2 h-5 w-5" /> Book 1-on-1 Session
              </Button>
              {mentor.courses?.some(c => c.sessionType === 'Group') && (
                <Button variant="outline" className="w-full py-3 text-lg font-semibold" onClick={() => toast({ title: "Joining Group Session", description: `Attempting to join a group session with ${mentor.name}.`, duration: 2000 })}>
                  <Users className="mr-2 h-5 w-5" /> Join Group Session
                </Button>
              )}
              <Button variant="secondary" className="w-full" onClick={() => toast({ title: "Sending Message", description: `Opening chat with ${mentor.name}.`, duration: 2000 })}>
                <MessageSquare className="mr-2 h-4 w-4" /> Send Message
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-grow" onClick={() => toast({ title: "Favorite Added", description: `${mentor.name} added to your favorites!`, duration: 2000 })}>
                  <Heart className="mr-2 h-4 w-4 text-error" /> Add to Favorites
                </Button>
                <Button variant="outline" className="flex-grow" onClick={() => toast({ title: "Share Profile", description: `Sharing ${mentor.name}'s profile.`, duration: 2000 })}>
                  <Share2 className="mr-2 h-4 w-4" /> Share Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="p-4 shadow-lg">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold">Pricing</CardTitle>
            </CardHeader>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-primary">₹{mentor.pricePerHour}</span>
              <span className="text-lg text-muted-foreground">/ hour</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              ({mentor.pricePerHour} coins equivalent)
            </p>
            <div className="space-y-2 mb-4">
              <Badge className="w-full justify-center py-1.5 text-base bg-success/20 text-success">
                10% off for 5+ sessions!
              </Badge>
              <Badge className="w-full justify-center py-1.5 text-base bg-secondary/20 text-secondary">
                15% off for 10+ sessions!
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Payment methods accepted: UPI, Debit/Credit Card, Net Banking, StudyBuddy Coins</p>
            <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 text-sm">
              Money-back guarantee
            </Badge>
          </Card>

          {/* Trust & Safety Elements */}
          <Card className="p-4 shadow-lg">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold">Trust & Safety</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {mentor.verificationBadges?.map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-5 w-5 text-success fill-success" />
                  <span>{badge}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-5 w-5 text-secondary" />
                <span>Response Rate: {mentor.responseRate || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-5 w-5 text-secondary" />
                <span>Avg. Response Time: {mentor.responseTime || 'N/A'}</span>
              </div>
              <Separator className="my-2" />
              <p className="text-sm text-muted-foreground">
                Cancellation Policy: {mentor.cancellationPolicy || 'Not specified.'}
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="destructive" size="sm" onClick={() => toast({ title: "Report Mentor", description: `Reporting ${mentor.name} for review.`, variant: "destructive", duration: 2000 })}>Report Mentor</Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Block Mentor", description: `Blocking ${mentor.name}.`, variant: "destructive", duration: 2000 })}>Block Mentor</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (60%) */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card className="p-6 shadow-lg">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">About {mentor.name}</CardTitle>
                </CardHeader>
                <div className="space-y-6 text-muted-foreground">
                  {mentor.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Biography</h3>
                      <p>{mentor.bio}</p>
                    </div>
                  )}
                  {mentor.education && mentor.education.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" /> Education Background
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {mentor.education.map((edu, i) => <li key={i}>{edu}</li>)}
                      </ul>
                    </div>
                  )}
                  {mentor.experience && mentor.experience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" /> Professional Experience
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {mentor.experience.map((exp, i) => <li key={i}>{exp}</li>)}
                      </ul>
                    </div>
                  )}
                  {mentor.teachingPhilosophy && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" /> Teaching Philosophy
                      </h3>
                      <p>{mentor.teachingPhilosophy}</p>
                    </div>
                  )}
                  {mentor.achievements && mentor.achievements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Award className="h-5 w-5" /> Achievements & Certifications
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {mentor.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                      </ul>
                    </div>
                  )}
                  {mentor.funFacts && mentor.funFacts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Smile className="h-5 w-5" /> Fun Facts
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {mentor.funFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="mt-6">
              <Card className="p-6 shadow-lg">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Courses by {mentor.name}</CardTitle>
                </CardHeader>
                {mentor.courses && mentor.courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mentor.courses.map((course) => (
                      <Card key={course.id} className="p-4 hover:shadow-lg transition-shadow">
                        <CardTitle className="text-lg font-bold mb-2">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <span>Duration: {course.duration}</span>
                          <Badge variant="outline">{course.difficulty}</Badge>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xl font-bold text-primary">
                            ₹{course.price}
                            <span className="text-sm text-muted-foreground"> ({course.price} coins)</span>
                          </div>
                          <Badge variant="secondary">{course.sessionType} Session</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-grow" onClick={() => toast({ title: "Booking Course", description: `Booking course: ${course.title}.`, duration: 2000 })}>Book Now</Button>
                          <Button variant="outline" className="flex-grow" onClick={() => toast({ title: "Previewing Curriculum", description: `Viewing curriculum for ${course.title}.`, duration: 2000 })}>
                            <Eye className="mr-2 h-4 w-4" /> Preview Curriculum
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <p className="text-lg">No courses available from this mentor yet.</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6 shadow-lg">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Reviews ({mentor.reviewCount})</CardTitle>
                </CardHeader>
                {mentor.reviews && mentor.reviews.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Overall Rating Breakdown</h3>
                      <div className="space-y-2">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="w-4 text-sm text-muted-foreground">{star} <Star className="h-3 w-3 inline-block fill-highlight-yellow text-highlight-yellow" /></span>
                            <Progress value={percentage} className="flex-grow h-2" />
                            <span className="w-10 text-right text-sm text-muted-foreground">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex gap-2 mb-4">
                      <Select defaultValue="most-recent">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter reviews" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="most-recent">Most Recent</SelectItem>
                          <SelectItem value="highest-rated">Highest Rated</SelectItem>
                          <SelectItem value="verified-only">Verified Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-6">
                      {mentor.reviews.map((review) => (
                        <Card key={review.id} className="p-4 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.avatar} alt={review.studentName} />
                              <AvatarFallback>{review.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">{review.studentName}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <div className="flex">{renderStars(review.rating)}</div>
                                <span>{review.rating.toFixed(1)}</span>
                                <span className="mx-1">•</span>
                                <span>{review.date}</span>
                                {review.isVerified && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <CheckCircle className="h-4 w-4 text-success fill-success ml-1" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Verified Booking</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Course: {review.courseTaken}</p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground mb-3 line-clamp-3">
                            {review.text}
                            {review.text.length > 150 && ( // Simple "Read More" logic
                              <Button variant="link" size="sm" className="p-0 h-auto ml-1" onClick={() => toast({ title: "Read More", description: "Expanding review text...", duration: 1000 })}>Read More</Button>
                            )}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-auto p-1" onClick={() => toast({ title: "Feedback Recorded", description: "Your feedback has been noted.", duration: 1000 })}>
                                <ThumbsUp className="h-4 w-4 mr-1" />
                              </Button>
                              <span>{review.helpfulVotes} Helpful</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-auto p-1" onClick={() => toast({ title: "Feedback Recorded", description: "Your feedback has been noted.", duration: 1000 })}>
                                <ThumbsDown className="h-4 w-4 mr-1" />
                              </Button>
                              <span>{review.notHelpfulVotes} Not Helpful</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Star className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <p className="text-lg">No reviews for this mentor yet.</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="mt-6">
              <Card className="p-6 shadow-lg">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Mentor's Schedule</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    All times are shown in your local timezone.
                  </p>
                  {/* Calendar Widget Placeholder */}
                  <div className="bg-muted rounded-lg p-4 h-64 flex items-center justify-center text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mr-2" />
                    <p className="text-lg">Interactive Calendar Widget Coming Soon!</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mentor.availability && mentor.availability.slice(0, 3).map((day) => (
                      <Card key={day.date} className="p-4">
                        <h4 className="font-semibold text-foreground mb-2">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map((slot, i) => (
                            <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => toast({ title: "View Calendar", description: `Opening full calendar for ${mentor.name}.`, duration: 2000 })}>
                    View Full Calendar <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
