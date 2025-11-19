'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function TeacherDashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('dashboard.welcome')}</h1>
      <p className="text-muted-foreground">{t('dashboard.description')}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacher.activeClasses')}</CardTitle>
            <CardDescription>{t('dashboard.teacher.activeClassesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{t('dashboard.teacher.classesCount', { count: 3 })}</p>
            <p className="text-sm text-muted-foreground">3A, 4B, 5C</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacher.totalStudents')}</CardTitle>
            <CardDescription>{t('dashboard.teacher.totalStudentsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{t('dashboard.teacher.studentsCount', { count: 78 })}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.teacher.newStudentsThisWeek', { count: 5 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacher.overallPerformance')}</CardTitle>
            <CardDescription>{t('dashboard.teacher.overallPerformanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{t('dashboard.teacher.averageScore', { percent: 82 })}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.teacher.scoreChange', { percent: -2 })}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
