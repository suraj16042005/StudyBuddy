/*
  # Initial Schema Setup

  This migration sets up the core tables for the StudyBuddy application, including user profiles, courses, and transactions. It establishes relationships between them and implements row-level security from the start.

  1.  **New Tables**
      - `profiles`: Stores public user data, linked to the `auth.users` table. Includes roles for students and mentors, and coin balances.
      - `courses`: Contains all information about the courses offered by mentors.
      - `transactions`: Tracks all coin-based transactions for users.

  2.  **Relationships**
      - `courses.mentor_id` references `profiles.id`.
      - `transactions.user_id` references `profiles.id`.

  3.  **Security**
      - Row Level Security (RLS) is enabled on all tables.
      - Policies are created to allow:
        - Users to view all public profiles and courses.
        - Authenticated users to manage their own profile and transactions.
        - Mentors to create and manage their own courses.
*/

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'student',
  excel_coin_balance integer NOT NULL DEFAULT 100,
  bio text,
  headline text
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    mentor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    short_description text,
    subject text,
    price_per_session integer NOT NULL DEFAULT 0,
    difficulty_level text,
    duration_minutes integer,
    total_sessions integer,
    course_image_url text,
    language text,
    average_rating numeric(2,1) DEFAULT 0.0,
    total_reviews integer DEFAULT 0,
    enrollment_count integer DEFAULT 0
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone."
  ON courses FOR SELECT
  USING ( true );

CREATE POLICY "Mentors can create courses."
  ON courses FOR INSERT
  WITH CHECK ( auth.uid() = mentor_id AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'mentor' );

CREATE POLICY "Mentors can update their own courses."
  ON courses FOR UPDATE
  USING ( auth.uid() = mentor_id );

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    transaction_type text,
    description text,
    status text
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions."
  ON transactions FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can create transactions for themselves."
  ON transactions FOR INSERT
  WITH CHECK ( auth.uid() = user_id );
