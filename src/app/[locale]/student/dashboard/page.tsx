'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function StudentDashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('dashboard.welcome')}</h1>
      <p className="text-muted-foreground">{t('dashboard.description')}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Challenge</CardTitle>
            <CardDescription>Your last completed challenge.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">The Adventures of Tom Sawyer</p>
            <p className="text-sm text-muted-foreground">9/10 correct answers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Progress</CardTitle>
            <CardDescription>Your learning stats.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">12 Challenges Completed</p>
            <p className="text-sm text-muted-foreground">85% average accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Rank</CardTitle>
            <CardDescription>Your current position.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">#5 in Class 3A</p>
            <p className="text-sm text-muted-foreground">Top 20%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
