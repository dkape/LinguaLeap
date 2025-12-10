'use client';

import { CreateLearningPathForm } from "@/components/teacher/create-learning-path-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/contexts/locale-context";

export default function CreatePathPage() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('teacher.create.title')}</CardTitle>
        <CardDescription>{t('teacher.create.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateLearningPathForm />
      </CardContent>
    </Card>
  );
}
