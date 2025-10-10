export type UserRole = 'student' | 'teacher';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  points?: number;
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
  icon: React.ElementType;
};

export type LeaderboardEntry = {
  rank: number;
  student: User;
  points: number;
};
