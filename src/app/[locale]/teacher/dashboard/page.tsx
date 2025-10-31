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
            <CardTitle>Active Classes</CardTitle>
            <CardDescription>Your current classes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">3 Classes</p>
            <p className="text-sm text-muted-foreground">3A, 4B, 5C</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <CardDescription>All students in your classes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">78 Students</p>
            <p className="text-sm text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
            <CardDescription>Average student performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">82% Average Score</p>
            <p className="text-sm text-muted-foreground">-2% from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
