export type UserRole = 'student' | 'teacher' | 'admin';

export type User = {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  points?: number;
  preferredLanguage?: 'de' | 'en';
  isEmailVerified?: boolean;
  createdAt: Date;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Level = {
  id: string;
  title: string;
  content: string;
  unlocked: boolean;
  quiz: QuizQuestion[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  levels: Level[];
  icon: React.ElementType | string;
};

export type LeaderboardEntry = {
  rank: number;
  student: User;
  points: number;
};

export interface Student {
  id: string;
  name: string;
  currentLesson: string;
  progress: number;
}