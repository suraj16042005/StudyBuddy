import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background py-8 mt-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-primary text-lg">
          <BookOpen className="h-6 w-6" />
          StudyBuddy
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-primary">
            About Us
          </Link>
          <Link to="/faq" className="hover:text-primary">
            FAQ
          </Link>
          <Link to="/terms" className="hover:text-primary">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-primary">
            Contact
          </Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} StudyBuddy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
