'use client';

import { Student } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from '@/contexts/locale-context';

interface StudentProgressCardProps {
  student: Student;
}

export function StudentProgressCard({ student }: StudentProgressCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{t('studentProgressCard.currentLesson')}: {student.currentLesson}</p>
        <Progress value={student.progress} />
      </CardContent>
    </Card>
  );
}
