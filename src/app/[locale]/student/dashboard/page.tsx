'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChallengeList } from '@/components/student/challenge-list';
import { Leaderboard } from '@/components/student/leaderboard';
import { Trophy, Target, Clock, BookText } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/contexts/locale-context';
import axios from 'axios';

interface Challenge {
  attempt_status: string;
  total_points_earned?: number;
  total_time_spent_seconds?: number;
}

interface StudentStats {
  totalPoints: number;
  completedChallenges: number;
  averageTime: number;
  currentRank: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<StudentStats>({
    totalPoints: 0,
    completedChallenges: 0,
    averageTime: 0,
    currentRank: 0
  });

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      const response = await axios.get('/challenges/student');
      const challenges = response.data.challenges;
      
      const completed = challenges.filter((c: Challenge) => c.attempt_status === 'completed');
      const totalPoints = completed.reduce((sum: number, c: Challenge) => sum + (c.total_points_earned || 0), 0);
      const totalTime = completed.reduce((sum: number, c: Challenge) => sum + (c.total_time_spent_seconds || 0), 0);
      const averageTime = completed.length > 0 ? totalTime / completed.length : 0;

      setStats({
        totalPoints,
        completedChallenges: completed.length,
        averageTime,
        currentRank: 0 // Will be updated from leaderboard
      });
    } catch (error) {
      console.error('Error fetching student stats:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">
          {t('dashboard.welcome')}, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          Löse spannende Herausforderungen, sammle Punkte und klettere die Bestenliste hinauf!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gesamtpunkte</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              {user.points || 0} Gesamtpunkte
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gelöste Herausforderungen</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedChallenges}</div>
            <p className="text-xs text-muted-foreground">
              erfolgreich abgeschlossen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Durchschnittszeit</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageTime > 0 ? formatTime(stats.averageTime) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              pro Herausforderung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktueller Rang</CardTitle>
            <BookText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currentRank > 0 ? `#${stats.currentRank}` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              in deiner Klasse
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges">Meine Herausforderungen</TabsTrigger>
          <TabsTrigger value="leaderboard">Bestenliste</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="space-y-6">
          <ChallengeList />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-6">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}