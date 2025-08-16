import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LearnPage } from './pages/LearnPage';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { MentorOnboardingPage } from './pages/MentorOnboardingPage';
import { MentorDashboardPage } from './pages/MentorDashboardPage';
import { CourseCreationPage } from './pages/CourseCreationPage';
import { Toaster } from './components/ui/toaster';
import { Button } from './components/ui/button';
import { useToast } from '@/hooks/use-toast'; // Corrected import path
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LearnPage />} /> {/* Default to Learn Page */}
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/mentors/:id" element={<MentorProfilePage />} />
            <Route path="/mentors/:id/book" element={<BookingFlowPage />} />
            <Route path="/become-mentor" element={<MentorOnboardingPage />} />
            <Route path="/mentor-dashboard" element={<MentorDashboardPage />} />
            <Route path="/mentor/create-course" element={<CourseCreationPage />} />
            {/* Add other routes as needed */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

function NotFound() {
  const { toast } = useToast(); // Initialize useToast

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button onClick={() => toast({ title: "Navigating Home", description: "You are already on the home page.", duration: 2000 })}>
          Go to Home
        </Button>
      </Link>
    </div>
  );
}

export default App;
