'use client';

import { StudentProgressList } from "@/components/teacher/StudentProgressList";
import { useTranslation } from "@/contexts/locale-context";

export default function StudentProgressPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-3xl font-bold">{t('student.progress.title')}</h1>
      <StudentProgressList />
    </div>
  );
}
