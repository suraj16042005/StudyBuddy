import { Link } from 'react-router-dom';
import { BookOpen, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary text-lg">
          <BookOpen className="h-6 w-6" />
          StudyBuddy
        </Link>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link to="/learn" className="text-sm font-medium transition-colors hover:text-primary">
            Find a Mentor
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            How it Works
          </Link>
          <Link to="/become-mentor" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Become a Mentor
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search mentors..."
              className="pl-8 w-[150px] lg:w-[250px]"
            />
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" className="hidden md:inline-flex">
            Login
          </Button>
          <Button className="hidden md:inline-flex">
            Sign Up
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <User className="h-5 w-5" />
            <span className="sr-only">User Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
