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
            <CardTitle>{t('dashboard.student.recentChallenge')}</CardTitle>
            <CardDescription>{t('dashboard.student.recentChallengeDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">The Adventures of Tom Sawyer</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.student.correctAnswers', { correct: 9, total: 10 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.student.currentProgress')}</CardTitle>
            <CardDescription>{t('dashboard.student.currentProgressDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{t('dashboard.student.challengesCompleted', { count: 12 })}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.student.averageAccuracy', { percent: 85 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.student.leaderboardRank')}</CardTitle>
            <CardDescription>{t('dashboard.student.leaderboardRankDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{t('dashboard.student.rankInClass', { rank: 5, class: '3A' })}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.student.topPercent', { percent: 20 })}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
