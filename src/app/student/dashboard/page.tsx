'use client';

import { useAuth } from '@/hooks/use-auth';
import { useDictionary } from '@/hooks/use-dictionary';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { dictionary } = useDictionary();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">
        {dictionary.student.title.replace('{name}', user.name)}
      </h1>
      <p className="text-muted-foreground">{dictionary.student.description}</p>
    </div>
  );
}
