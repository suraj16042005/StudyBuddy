import { Flag } from 'lucide-react';

export interface Mentor {
  id: string;
  name: string;
  headline: string;
  rating: number;
  reviewCount: number;
  languages: { name: string; icon: string }[];
  pricePerHour: number;
  isAvailableNow: boolean;
  subjects: string[];
  profilePhoto: string;
  coverPhoto?: string;
  totalSessions?: number;
  responseTime?: string;
  studentsTaught?: number;
  demoVideoUrl?: string;
  bio?: string;
  education?: string[];
  experience?: string[];
  teachingPhilosophy?: string;
  achievements?: string[];
  funFacts?: string[];
  courses?: Course[];
  reviews?: Review[];
  availability?: { date: string; slots: string[] }[];
  verificationBadges?: string[];
  responseRate?: string;
  cancellationPolicy?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  sessionType: '1-on-1' | 'Group';
  bookingCount?: number;
  rating?: number;
  reviews?: number;
  curriculum?: string[];
}

export interface Review {
  id: string;
  studentName: string;
  avatar: string;
  rating: number;
  date: string;
  courseTaken: string;
  text: string;
  helpfulVotes: number;
  notHelpfulVotes: number;
  isVerified: boolean;
}

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Anya Sharma',
    headline: 'PhD in AI, 10+ years experience in Machine Learning',
    rating: 4.9,
    reviewCount: 128,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Hindi', icon: '🇮🇳' }],
    pricePerHour: 1500,
    isAvailableNow: true,
    subjects: ['Machine Learning', 'Python', 'Data Science'],
    profilePhoto: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 520,
    responseTime: '5 mins',
    studentsTaught: 350,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Dr. Anya Sharma is a distinguished AI researcher and educator with over a decade of experience in machine learning and deep learning. She holds a PhD in Artificial Intelligence from IIT Bombay and has worked with leading tech companies. Her passion lies in making complex AI concepts accessible to everyone, from beginners to advanced practitioners. She believes in hands-on learning and real-world project applications.',
    education: ['PhD in AI, IIT Bombay', 'M.Tech in Computer Science, NIT Warangal'],
    experience: ['Senior AI Scientist, TechCorp (5 years)', 'Lead Data Scientist, InnovateAI (3 years)', 'Research Assistant, IIT Bombay (2 years)'],
    teachingPhilosophy: 'My philosophy is to foster critical thinking and problem-solving skills. I encourage students to ask questions, experiment, and build projects. Learning should be an engaging and interactive journey.',
    achievements: ['Published 10+ research papers in top-tier AI conferences', 'Awarded "Best Educator" by StudyBuddy 2023'],
    funFacts: ['Loves hiking in the Himalayas', 'Plays classical guitar', 'Fluent in 5 programming languages'],
    courses: [
      { id: 'c1', title: 'Introduction to Python for Data Science', description: 'Learn Python fundamentals for data analysis.', duration: '10 hours', difficulty: 'Beginner', price: 8000, sessionType: 'Group', bookingCount: 50, rating: 4.8, reviews: 45 },
      { id: 'c2', title: 'Deep Learning with TensorFlow', description: 'Master neural networks and deep learning architectures.', duration: '20 hours', difficulty: 'Advanced', price: 18000, sessionType: '1-on-1', bookingCount: 20, rating: 4.9, reviews: 18 },
    ],
    reviews: [
      { id: 'r1', studentName: 'Ankit S.', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-20', courseTaken: 'Deep Learning with TensorFlow', text: 'Dr. Sharma is an exceptional mentor! Her explanations are crystal clear, and she makes complex topics easy to understand. Highly recommend!', helpfulVotes: 15, notHelpfulVotes: 0, isVerified: true },
      { id: 'r2', studentName: 'Priya K.', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-18', courseTaken: 'Introduction to Python for Data Science', text: 'Fantastic course for beginners. I learned so much and feel confident in my Python skills now. Thank you!', helpfulVotes: 10, notHelpfulVotes: 1, isVerified: true },
    ],
    availability: [
      { date: '2024-08-01', slots: ['10:00 AM', '11:00 AM', '02:00 PM'] },
      { date: '2024-08-02', slots: ['09:00 AM', '01:00 PM', '04:00 PM'] },
    ],
    verificationBadges: ['ID Verified', 'Education Verified', 'Background Check'],
    responseRate: '98%',
    cancellationPolicy: '24-hour notice required for full refund.',
  },
  {
    id: 'mentor-2',
    name: 'Rahul Singh',
    headline: 'Full Stack Developer, Expert in React & Node.js',
    rating: 4.8,
    reviewCount: 95,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Marathi', icon: '🇮🇳' }],
    pricePerHour: 1200,
    isAvailableNow: false,
    subjects: ['React', 'Node.js', 'JavaScript', 'Web Development'],
    profilePhoto: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 380,
    responseTime: '10 mins',
    studentsTaught: 280,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Rahul is a passionate full-stack developer with 7 years of experience building scalable web applications. He specializes in React, Node.js, and modern JavaScript frameworks. He loves mentoring aspiring developers and helping them build strong foundational skills and practical projects.',
    education: ['B.Tech in Computer Engineering, VIT Vellore'],
    experience: ['Senior Software Engineer, WebSolutions (4 years)', 'Software Developer, StartupX (3 years)'],
    teachingPhilosophy: 'Hands-on coding and project-based learning are key. I focus on practical application and debugging skills, preparing students for real-world development challenges.',
    achievements: ['Led development of a major e-commerce platform', 'Mentored 50+ junior developers'],
    funFacts: ['Avid gamer', 'Enjoys cooking Italian food', 'Loves open-source contributions'],
    courses: [
      { id: 'c3', title: 'React.js Fundamentals', description: 'Build your first interactive web applications with React.', duration: '8 hours', difficulty: 'Beginner', price: 6500, sessionType: '1-on-1', bookingCount: 40, rating: 4.7, reviews: 35 },
      { id: 'c4', title: 'Node.js & Express API Development', description: 'Learn to build robust backend APIs with Node.js.', duration: '12 hours', difficulty: 'Intermediate', price: 9500, sessionType: 'Group', bookingCount: 25, rating: 4.8, reviews: 20 },
    ],
    reviews: [
      { id: 'r3', studentName: 'Sneha R.', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-19', courseTaken: 'React.js Fundamentals', text: 'Rahul sir is very patient and explains concepts clearly. My React skills improved a lot!', helpfulVotes: 8, notHelpfulVotes: 0, isVerified: true },
      { id: 'r4', studentName: 'Vikram M.', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 4, date: '2024-07-15', courseTaken: 'Node.js & Express API Development', text: 'Good course, but sometimes moved a bit fast. Overall helpful.', helpfulVotes: 5, notHelpfulVotes: 2, isVerified: false },
    ],
    availability: [
      { date: '2024-08-03', slots: ['11:00 AM', '03:00 PM'] },
      { date: '2024-08-04', slots: ['10:00 AM', '02:00 PM'] },
    ],
    verificationBadges: ['ID Verified', 'Education Verified'],
    responseRate: '95%',
    cancellationPolicy: '48-hour notice for rescheduling.',
  },
  {
    id: 'mentor-3',
    name: 'Priya Devi',
    headline: 'Experienced English Language Tutor & IELTS Coach',
    rating: 4.7,
    reviewCount: 72,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Tamil', icon: '🇮🇳' }],
    pricePerHour: 800,
    isAvailableNow: true,
    subjects: ['English Grammar', 'IELTS Prep', 'Spoken English'],
    profilePhoto: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 250,
    responseTime: '8 mins',
    studentsTaught: 180,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Priya is a certified English language tutor with 5 years of experience. She specializes in helping students improve their grammar, vocabulary, and conversational skills, as well as preparing them for IELTS exams. Her classes are interactive and tailored to individual needs.',
    education: ['MA in English Literature, University of Delhi', 'CELTA Certification'],
    experience: ['English Language Instructor, Global Academy (3 years)', 'Private Tutor (2 years)'],
    teachingPhilosophy: 'I believe in creating a supportive and engaging environment where students feel comfortable practicing and making mistakes. Repetition and real-life scenarios are crucial for language acquisition.',
    achievements: ['Helped 90% of students achieve target IELTS scores', 'Developed custom curriculum for conversational English'],
    funFacts: ['Loves reading classic novels', 'Enjoys painting in her free time', 'Travelled to 10+ countries'],
    courses: [
      { id: 'c5', title: 'IELTS Speaking & Writing Mastery', description: 'Comprehensive preparation for IELTS speaking and writing modules.', duration: '15 hours', difficulty: 'Intermediate', price: 10000, sessionType: '1-on-1', bookingCount: 30, rating: 4.9, reviews: 25 },
    ],
    reviews: [
      { id: 'r5', studentName: 'Arjun S.', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-22', courseTaken: 'IELTS Speaking & Writing Mastery', text: 'Priya ma\'am is excellent! Her tips for IELTS were invaluable, and I improved my score significantly.', helpfulVotes: 12, notHelpfulVotes: 0, isVerified: true },
    ],
    availability: [
      { date: '2024-08-01', slots: ['09:00 AM', '01:00 PM'] },
      { date: '2024-08-03', slots: ['10:00 AM', '02:00 PM'] },
    ],
    verificationBadges: ['ID Verified', 'Education Verified'],
    responseRate: '99%',
    cancellationPolicy: 'No refunds for cancellations within 12 hours.',
  },
  {
    id: 'mentor-4',
    name: 'Siddharth Rao',
    headline: 'Mathematics Olympiad Coach & IIT JEE Mentor',
    rating: 4.9,
    reviewCount: 150,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Telugu', icon: '🇮🇳' }],
    pricePerHour: 1800,
    isAvailableNow: true,
    subjects: ['Calculus', 'Algebra', 'IIT JEE Math', 'Olympiad Math'],
    profilePhoto: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 600,
    responseTime: '3 mins',
    studentsTaught: 400,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Siddharth is a highly sought-after Mathematics mentor with a proven track record of helping students excel in competitive exams like IIT JEE and various Olympiads. An IIT Delhi alumnus, he simplifies complex mathematical problems and builds strong conceptual understanding.',
    education: ['B.Tech in Electrical Engineering, IIT Delhi'],
    experience: ['Math Faculty, Premier Coaching Institute (8 years)', 'Private JEE Mentor (5 years)'],
    teachingPhilosophy: 'My approach is problem-solving centric. I guide students through challenging problems, encouraging them to think critically and develop their own solutions, rather than just memorizing formulas.',
    achievements: ['Mentored 50+ students to secure ranks in top 1000 in IIT JEE', 'Authored a book on advanced calculus problems'],
    funFacts: ['Loves playing chess', 'Enjoys solving Sudoku puzzles', 'Passionate about space exploration'],
    courses: [
      { id: 'c6', title: 'IIT JEE Mathematics Crash Course', description: 'Intensive course covering key topics for IIT JEE Math.', duration: '25 hours', difficulty: 'Advanced', price: 20000, sessionType: 'Group', bookingCount: 60, rating: 4.9, reviews: 55 },
    ],
    reviews: [
      { id: 'r6', studentName: 'Divya P.', avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-21', courseTaken: 'IIT JEE Mathematics Crash Course', text: 'Siddharth sir is a genius! He made calculus so easy. Highly recommend for JEE aspirants.', helpfulVotes: 20, notHelpfulVotes: 0, isVerified: true },
    ],
    availability: [
      { date: '2024-08-02', slots: ['06:00 PM', '07:00 PM'] },
      { date: '2024-08-04', slots: ['09:00 AM', '10:00 AM'] },
    ],
    verificationBadges: ['ID Verified', 'Education Verified', 'Background Check'],
    responseRate: '100%',
    cancellationPolicy: 'Flexible cancellation with 6-hour notice.',
  },
  {
    id: 'mentor-5',
    name: 'Anjali Gupta',
    headline: 'Experienced Science Educator (Physics, Chemistry, Biology)',
    rating: 4.6,
    reviewCount: 88,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Gujarati', icon: '🇮🇳' }],
    pricePerHour: 1000,
    isAvailableNow: false,
    subjects: ['Physics', 'Chemistry', 'Biology', 'NEET Prep'],
    profilePhoto: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/414860/pexels-photo-414860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 300,
    responseTime: '15 mins',
    studentsTaught: 220,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Anjali is a dedicated science educator with a passion for making science fun and understandable. She has 6 years of experience teaching Physics, Chemistry, and Biology to high school and NEET aspirants. Her interactive lessons and real-world examples help students grasp complex scientific principles.',
    education: ['M.Sc. in Physics, University of Mumbai', 'B.Ed. in Science Education'],
    experience: ['Science Teacher, Elite School (4 years)', 'NEET Coaching Faculty (2 years)'],
    teachingPhilosophy: 'I believe in conceptual clarity and practical application. Science is all around us, and I strive to connect theoretical knowledge with everyday phenomena to make learning engaging and memorable.',
    achievements: ['Achieved 95% success rate for NEET students', 'Developed innovative lab experiments for online teaching'],
    funFacts: ['Loves stargazing', 'Enjoys gardening', 'Volunteers at local animal shelters'],
    courses: [
      { id: 'c7', title: 'NEET Physics Essentials', description: 'Master key Physics concepts for NEET exam.', duration: '18 hours', difficulty: 'Intermediate', price: 12000, sessionType: '1-on-1', bookingCount: 28, rating: 4.7, reviews: 22 },
    ],
    reviews: [
      { id: 'r7', studentName: 'Rohan D.', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 4, date: '2024-07-17', courseTaken: 'NEET Physics Essentials', text: 'Good explanations, but sometimes the pace was a bit slow for me. Still, very thorough.', helpfulVotes: 7, notHelpfulVotes: 1, isVerified: true },
    ],
    availability: [
      { date: '2024-08-05', slots: ['05:00 PM', '06:00 PM'] },
      { date: '2024-08-06', slots: ['07:00 PM'] },
    ],
    verificationBadges: ['ID Verified', 'Education Verified'],
    responseRate: '90%',
    cancellationPolicy: '24-hour notice for full refund.',
  },
  {
    id: 'mentor-6',
    name: 'Kabir Khan',
    headline: 'Business Strategy Consultant & MBA Admissions Coach',
    rating: 4.8,
    reviewCount: 60,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Hindi', icon: '🇮🇳' }],
    pricePerHour: 1600,
    isAvailableNow: true,
    subjects: ['Business Strategy', 'Marketing', 'Finance', 'MBA Admissions'],
    profilePhoto: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 180,
    responseTime: '7 mins',
    studentsTaught: 100,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Kabir is a seasoned business consultant with 10+ years of experience in strategy and marketing. He holds an MBA from IIM Ahmedabad and has advised numerous startups and large corporations. He also mentors aspiring MBA candidates, helping them craft compelling applications and ace interviews.',
    education: ['MBA, IIM Ahmedabad', 'B.Com (Hons), Delhi University'],
    experience: ['Strategy Consultant, Global Consulting (6 years)', 'Marketing Manager, FMCG Co. (4 years)'],
    teachingPhilosophy: 'I focus on practical case studies and real-world business scenarios. My goal is to equip students with analytical frameworks and strategic thinking skills applicable to any business challenge.',
    achievements: ['Helped 80% of MBA mentees get into top 20 B-schools', 'Successfully launched 3 new product lines for clients'],
    funFacts: ['Enjoys playing squash', 'Passionate about financial markets', 'Loves exploring new cuisines'],
    courses: [
      { id: 'c8', title: 'MBA Application Strategy & Interview Prep', description: 'Comprehensive guidance for MBA applications and interview success.', duration: '10 hours', difficulty: 'Advanced', price: 15000, sessionType: '1-on-1', bookingCount: 15, rating: 4.8, reviews: 10 },
    ],
    reviews: [
      { id: 'r8', studentName: 'Ishaan V.', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-20', courseTaken: 'MBA Application Strategy & Interview Prep', text: 'Kabir sir\'s insights were game-changing for my MBA application. Got into my dream school!', helpfulVotes: 9, notHelpfulVotes: 0, isVerified: true },
    ],
    availability: [
      { date: '2024-08-01', slots: ['07:00 PM', '08:00 PM'] },
      { date: '2024-08-03', slots: ['06:00 PM'] },
    ],
    verificationBadges: ['ID Verified', 'Education Verified'],
    responseRate: '97%',
    cancellationPolicy: '24-hour notice for rescheduling.',
  },
  {
    id: 'mentor-7',
    name: 'Sara Ali',
    headline: 'Creative Writing Coach & Content Strategist',
    rating: 4.7,
    reviewCount: 45,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Bengali', icon: '🇮🇳' }],
    pricePerHour: 900,
    isAvailableNow: true,
    subjects: ['Creative Writing', 'Content Marketing', 'Copywriting'],
    profilePhoto: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/1167129/pexels-photo-1167129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 120,
    responseTime: '12 mins',
    studentsTaught: 80,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Sara is a passionate writer and content strategist with 5 years of experience. She helps aspiring writers hone their craft, develop unique voices, and create compelling narratives. She also guides professionals in crafting effective content marketing strategies.',
    education: ['M.A. in Journalism and Mass Communication, JNU'],
    experience: ['Content Lead, Digital Agency (3 years)', 'Freelance Writer & Editor (2 years)'],
    teachingPhilosophy: 'Writing is a journey of discovery. I provide constructive feedback, encourage experimentation, and help students find their authentic voice. Practice and consistent feedback are key.',
    achievements: ['Awarded "Best Short Story" in a national competition', 'Managed content for 3 successful product launches'],
    funFacts: ['Loves exploring new cafes', 'Enjoys photography', 'Has a collection of vintage typewriters'],
    courses: [
      { id: 'c9', title: 'Foundations of Creative Writing', description: 'Learn the basics of storytelling, character development, and plot.', duration: '8 hours', difficulty: 'Beginner', price: 7000, sessionType: 'Group', bookingCount: 20, rating: 4.6, reviews: 15 },
    ],
    reviews: [
      { id: 'r9', studentName: 'Diya S.', avatar: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-19', courseTaken: 'Foundations of Creative Writing', text: 'Sara ma\'am is inspiring! Her feedback was so helpful, and I feel much more confident in my writing.', helpfulVotes: 6, notHelpfulVotes: 0, isVerified: true },
    ],
    availability: [
      { date: '2024-08-02', slots: ['04:00 PM', '05:00 PM'] },
      { date: '2024-08-04', slots: ['03:00 PM'] },
    ],
    verificationBadges: ['ID Verified'],
    responseRate: '92%',
    cancellationPolicy: '48-hour notice for rescheduling.',
  },
  {
    id: 'mentor-8',
    name: 'Arjun Reddy',
    headline: 'Data Structures & Algorithms Expert, Competitive Programmer',
    rating: 4.9,
    reviewCount: 110,
    languages: [{ name: 'English', icon: '🇬🇧' }, { name: 'Telugu', icon: '🇮🇳' }],
    pricePerHour: 1400,
    isAvailableNow: true,
    subjects: ['Data Structures', 'Algorithms', 'Competitive Programming', 'C++'],
    profilePhoto: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coverPhoto: 'https://images.pexels.com/photos/177598/pexels-photo-177598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    totalSessions: 450,
    responseTime: '4 mins',
    studentsTaught: 300,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    bio: 'Arjun is a top-tier competitive programmer and a master of Data Structures and Algorithms. He has represented India in international programming contests and has a knack for simplifying complex algorithmic problems. He enjoys preparing students for coding interviews and competitive programming challenges.',
    education: ['B.Tech in Computer Science, IIT Madras'],
    experience: ['Software Development Engineer, TechGiant (4 years)', 'Competitive Programming Coach (3 years)'],
    teachingPhilosophy: 'Problem-solving is a muscle. I focus on building strong fundamentals, breaking down complex problems, and practicing consistently. My goal is to empower students to think algorithmically.',
    achievements: ['Ranked in top 100 in Google Code Jam', 'Secured gold medal in National Informatics Olympiad'],
    funFacts: ['Loves playing badminton', 'Enjoys solving Rubik\'s Cube', 'Passionate about space exploration'],
    courses: [
      { id: 'c10', title: 'DSA for Coding Interviews', description: 'Master Data Structures and Algorithms for top tech company interviews.', duration: '15 hours', difficulty: 'Intermediate', price: 12000, sessionType: '1-on-1', bookingCount: 35, rating: 4.9, reviews: 30 },
    ],
    reviews: [
      { id: 'r10', studentName: 'Karthik N.', avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5, date: '2024-07-23', courseTaken: 'DSA for Coding Interviews', text: 'Arjun sir is brilliant! He helped me crack my dream company\'s coding interview. Best DSA mentor!', helpfulVotes: 18, notHelpfulVotes: 0, isVerified: true },
    ],
    availability: [
      { date: '2024-08-01', slots: ['08:00 PM', '09:00 PM'] },
      { date: '2024-08-03', slots: ['07:00 PM'] },
    ],
    verificationBadges: ['ID Verified', 'Education Verified', 'Background Check'],
    responseRate: '99%',
    cancellationPolicy: '24-hour notice for full refund.',
  },
];
