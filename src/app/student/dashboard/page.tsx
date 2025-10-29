'use client';

import { useAuth } from '@/hooks/use-auth';
import { useLocale } from '@/contexts/locale-context';
import { t } from '@/lib/dictionaries';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { dict } = useLocale();

  if (!user) {
    return <div>{t(dict, 'common.loading')}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">
        {t(dict, 'dashboard.welcome')}, {user.name}!
      </h1>
      <p className="text-muted-foreground">{t(dict, 'dashboard.student.description')}</p>
    </div>
  );
}
