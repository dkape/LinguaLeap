'use client';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

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
  activeChallenges: number;
  averageTime: number;
  currentRank: number;
  weeklyProgress: number;
  nextAchievement: {
    name: string;
    progress: number;
    pointsNeeded: number;
  };
  recentActivity: Array<{
    type: 'challenge_complete' | 'achievement_earned' | 'level_up';
    title: string;
    timestamp: string;
  }>;
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
      const active = challenges.filter((c: Challenge) => c.attempt_status === 'in_progress');
      const totalPoints = completed.reduce((sum: number, c: Challenge) => sum + (c.total_points_earned || 0), 0);
      const totalTime = completed.reduce((sum: number, c: Challenge) => sum + (c.total_time_spent_seconds || 0), 0);
      const averageTime = completed.length > 0 ? totalTime / completed.length : 0;

      // Get weekly progress and next achievement
      const weeklyResponse = await axios.get('/student/weekly-progress');
      const achievementResponse = await axios.get('/student/next-achievement');
      const activityResponse = await axios.get('/student/recent-activity');

      setStats({
        totalPoints,
        completedChallenges: completed.length,
        activeChallenges: active.length,
        averageTime,
        currentRank: 0, // Will be updated from leaderboard
        weeklyProgress: weeklyResponse.data.progress,
        nextAchievement: achievementResponse.data,
        recentActivity: activityResponse.data.activities
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
        <p className="text-muted-foreground">{t('dashboard.student.description')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.student.totalPoints')}</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.student.totalPointsSubtitle', { count: user.points || 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.student.solvedChallenges')}</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedChallenges}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.student.successfullyCompleted')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.student.averageTime')}</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageTime > 0 ? formatTime(stats.averageTime) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.student.perChallenge')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.student.currentRank')}</CardTitle>
            <BookText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currentRank > 0 ? `#${stats.currentRank}` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.student.inYourClass')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress & Achievements */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.student.weeklyProgress')}</CardTitle>
            <CardDescription>{t('dashboard.student.weeklyProgressDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dashboard.student.progress')}</span>
                <span className="text-sm text-muted-foreground">{stats.weeklyProgress}%</span>
              </div>
              <Progress value={stats.weeklyProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.student.nextAchievement')}</CardTitle>
            <CardDescription>{stats.nextAchievement.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dashboard.student.pointsNeeded')}</span>
                <span className="text-sm text-muted-foreground">
                  {stats.nextAchievement.pointsNeeded - totalPoints} {t('dashboard.student.pointsToGo')}
                </span>
              </div>
              <Progress value={stats.nextAchievement.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.student.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                {activity.type === 'challenge_complete' && <Target className="h-5 w-5 text-green-500 mt-0.5" />}
                {activity.type === 'achievement_earned' && <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />}
                {activity.type === 'level_up' && <Star className="h-5 w-5 text-purple-500 mt-0.5" />}
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges">{t('dashboard.student.myChallenges')}</TabsTrigger>
          <TabsTrigger value="leaderboard">{t('dashboard.student.leaderboard')}</TabsTrigger>
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