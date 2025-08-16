import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, CheckCircle, Eye } from 'lucide-react';
import { Mentor } from '@/data/mentors';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Corrected import path

interface MentorCardProps {
  mentor: Mentor;
  viewType: 'grid' | 'list';
}

export function MentorCard({ mentor, viewType }: MentorCardProps) {
  const { toast } = useToast(); // Initialize useToast

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < Math.floor(rating) ? 'fill-highlight-yellow text-highlight-yellow' : 'text-on-surface-variant'
          )}
        />
      );
    }
    return stars;
  };

  if (viewType === 'list') {
    return (
      <Card className="flex flex-col md:flex-row items-center p-4 md:p-6 gap-4 md:gap-6 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
        <div className="relative flex-shrink-0">
          <Avatar className="h-24 w-24 md:h-28 md:w-28 border-2 border-primary/50">
            <AvatarImage src={mentor.profilePhoto} alt={mentor.name} />
            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {mentor.isAvailableNow && (
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-secondary border-2 border-background" title="Available Now"></span>
          )}
          {mentor.verificationBadges?.includes('ID Verified') && (
            <CheckCircle className="absolute top-0 right-0 h-5 w-5 text-primary fill-primary bg-background rounded-full" title="Verified Mentor" />
          )}
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <Link to={`/mentors/${mentor.id}`} className="hover:underline">
            <CardTitle className="text-xl font-bold text-on-surface">{mentor.name}</CardTitle>
          </Link>
          <p className="text-sm text-on-surface-variant">{mentor.headline}</p>
          <div className="flex items-center justify-center md:justify-start gap-1 text-sm">
            <div className="flex">{renderStars(mentor.rating)}</div>
            <span className="font-semibold text-on-surface">{mentor.rating.toFixed(1)}</span>
            <span className="text-on-surface-variant">({mentor.reviewCount} reviews)</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {mentor.languages.map((lang) => (
              <Badge key={lang.name} variant="secondary" className="flex items-center gap-1">
                {lang.icon} {lang.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {mentor.subjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="outline" className="text-xs">
                {subject}
              </Badge>
            ))}
            {mentor.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3 md:ml-auto">
          <div className="text-2xl font-bold text-primary">
            ₹{mentor.pricePerHour}
            <span className="text-base text-on-surface-variant">/hr</span>
          </div>
          <p className="text-sm text-on-surface-variant">({mentor.pricePerHour} coins)</p>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => toast({ title: "Favorite Added", description: `${mentor.name} added to your favorites!`, duration: 2000 })}>
              <Heart className="h-5 w-5 text-error" />
              <span className="sr-only">Add to favorites</span>
            </Button>
            <Link to={`/mentors/${mentor.id}`}>
              <Button onClick={() => toast({ title: "Previewing Mentor", description: `Navigating to ${mentor.name}'s profile.`, duration: 2000 })}>Quick Preview</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm h-[400px] flex flex-col rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader className="relative p-0 h-40 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={mentor.profilePhoto} alt={mentor.name} />
          <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        {mentor.isAvailableNow && (
          <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-secondary border-2 border-background" title="Available Now"></span>
        )}
        {mentor.verificationBadges?.includes('ID Verified') && (
          <CheckCircle className="absolute top-2 right-2 h-6 w-6 text-primary fill-primary bg-background rounded-full" title="Verified Mentor" />
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4 text-center space-y-2">
        <Link to={`/mentors/${mentor.id}`} className="hover:underline">
          <CardTitle className="text-lg font-bold leading-tight text-on-surface">{mentor.name}</CardTitle>
        </Link>
        <p className="text-xs text-on-surface-variant line-clamp-1">{mentor.headline}</p>
        <div className="flex items-center justify-center gap-1 text-sm">
          <div className="flex">{renderStars(mentor.rating)}</div>
          <span className="font-semibold text-on-surface">{mentor.rating.toFixed(1)}</span>
          <span className="text-on-surface-variant">({mentor.reviewCount})</span>
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {mentor.languages.map((lang) => (
            <Badge key={lang.name} variant="secondary" className="text-xs px-1.5 py-0.5">
              {lang.icon} {lang.name}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {mentor.subjects.slice(0, 3).map((subject) => (
            <Badge key={subject} variant="outline" className="text-xs">
              {subject}
            </Badge>
          ))}
          {mentor.subjects.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{mentor.subjects.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="text-xl font-bold text-primary">
          ₹{mentor.pricePerHour}
          <span className="text-sm text-on-surface-variant">/hr</span>
          <p className="text-xs text-on-surface-variant">({mentor.pricePerHour} coins)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => toast({ title: "Favorite Added", description: `${mentor.name} added to your favorites!`, duration: 2000 })}>
            <Heart className="h-4 w-4 text-error" />
            <span className="sr-only">Add to favorites</span>
          </Button>
          <Link to={`/mentors/${mentor.id}`}>
            <Button size="sm" className="flex items-center gap-1" onClick={() => toast({ title: "Previewing Mentor", description: `Navigating to ${mentor.name}'s profile.`, duration: 2000 })}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
