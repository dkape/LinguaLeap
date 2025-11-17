'use client';

import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/contexts/locale-context';

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">{t('profile')}</h1>
      <div className="mt-6">
        <p>
          <strong>{t('name')}:</strong> {user.name}
        </p>
        <p>
          <strong>{t('email')}:</strong> {user.email}
        </p>
        <p>
          <strong>{t('role')}:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}
