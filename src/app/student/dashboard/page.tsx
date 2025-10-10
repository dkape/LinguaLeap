'use client';

import { useAuth } from '@/hooks/use-auth';

export default function StudentDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">
        Welcome, {user.name}!
      </h1>
      <p className="text-muted-foreground">Your adventure in reading is about to begin. Get ready to explore magical worlds and make new friends, all while learning to read.</p>
    </div>
  );
}
