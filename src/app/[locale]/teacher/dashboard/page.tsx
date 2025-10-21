'use client';

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
      const [classesResponse, challengesResponse] = await Promise.all([
        axios.get('/classes/teacher'),
        axios.get('/challenges/teacher')
      ]);

      const classes = classesResponse.data.classes;
      const challenges = challengesResponse.data.challenges;

      const totalStudents = classes.reduce((sum: number, cls: ClassData) => sum + cls.student_count, 0);
      const activeChallenges = challenges.filter((c: ChallengeData) => c.isActive).length;

      setStats({
        totalStudents,
        totalClasses: classes.length,
        totalChallenges: challenges.length,
        activeChallenges
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
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Klassen, erstellen Sie spannende Herausforderungen und verfolgen Sie den Fortschritt Ihrer Schüler.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.teacher.students')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">in {stats.totalClasses} Klassen</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Klassen</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">aktive Klassen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Herausforderungen</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChallenges}</div>
            <p className="text-xs text-muted-foreground">{stats.activeChallenges} aktiv</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lernpfade</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">erstellt</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Herausforderungen</TabsTrigger>
          <TabsTrigger value="classes">Klassen</TabsTrigger>
          <TabsTrigger value="learning-paths">Lernpfade</TabsTrigger>
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