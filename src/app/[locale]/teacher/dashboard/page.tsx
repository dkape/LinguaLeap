'use client';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLearningPathForm } from "@/components/teacher/create-learning-path-form";
import { CreateChallengeForm } from "@/components/teacher/create-challenge-form";
import { ClassManagement } from "@/components/teacher/class-management";
import { BookCopy, GraduationCap, Users as UsersIcon, Target } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/contexts/locale-context";
import axios from 'axios';

interface ClassData {
  student_count: number;
}

interface ChallengeData {
  isActive: boolean;
}

interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalChallenges: number;
  activeChallenges: number;
  totalLearningPaths: number;
  activeLearningPaths: number;
  studentPerformance: {
    avgCompletionRate: number;
    avgScore: number;
  };
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalChallenges: 0,
    activeChallenges: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [classesResponse, challengesResponse, learningPathsResponse, performanceResponse] = await Promise.all([
        axios.get('/classes/teacher'),
        axios.get('/challenges/teacher'),
        axios.get('/learning-paths/teacher'),
        axios.get('/analytics/teacher/performance')
      ]);

      const classes = classesResponse.data.classes;
      const challenges = challengesResponse.data.challenges;

      const totalStudents = classes.reduce((sum: number, cls: ClassData) => sum + cls.student_count, 0);
      const activeChallenges = challenges.filter((c: ChallengeData) => c.isActive).length;

      const learningPaths = learningPathsResponse.data.learningPaths;
      const activeLearningPaths = learningPaths.filter((p: any) => p.isActive).length;
      const performance = performanceResponse.data;

      setStats({
        totalStudents,
        totalClasses: classes.length,
        totalChallenges: challenges.length,
        activeChallenges,
        totalLearningPaths: learningPaths.length,
        activeLearningPaths,
        studentPerformance: {
          avgCompletionRate: performance.averageCompletionRate,
          avgScore: performance.averageScore
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  if (!user) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('dashboard.welcome')}, {user.name}!</h1>
        <p className="text-muted-foreground">{t('dashboard.teacher.description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.teacher.students')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.teacher.inClasses', { count: stats.totalClasses })}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.teacher.classes')}</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.teacher.activeClasses')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.teacher.challenges')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChallenges}</div>
            <p className="text-xs text-muted-foreground">{stats.activeChallenges} {t('dashboard.teacher.active')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.teacher.learningPaths')}</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLearningPaths}</div>
            <p className="text-xs text-muted-foreground">{stats.activeLearningPaths} {t('dashboard.teacher.activePaths')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.teacher.performanceAnalytics')}</CardTitle>
          <CardDescription>{t('dashboard.teacher.performanceDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dashboard.teacher.avgCompletionRate')}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(stats.studentPerformance.avgCompletionRate * 100)}%
                </span>
              </div>
              <Progress value={stats.studentPerformance.avgCompletionRate * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dashboard.teacher.avgScore')}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(stats.studentPerformance.avgScore * 100)}%
                </span>
              </div>
              <Progress value={stats.studentPerformance.avgScore * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">{t('dashboard.teacher.challenges')}</TabsTrigger>
          <TabsTrigger value="classes">{t('dashboard.teacher.classes')}</TabsTrigger>
          <TabsTrigger value="learning-paths">{t('dashboard.teacher.learningPaths')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="space-y-6">
          <CreateChallengeForm />
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-6">
          <ClassManagement />
        </TabsContent>
        
        <TabsContent value="learning-paths" className="space-y-6">
          <CreateLearningPathForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}