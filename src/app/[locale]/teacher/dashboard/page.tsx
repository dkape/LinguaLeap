'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@/hooks/use-auth";

interface DashboardStats {
  activeClasses: number;
  totalStudents: number;
  averageScore: number;
  classesList: string[];
}

export default function TeacherDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeClasses: 0,
    totalStudents: 0,
    averageScore: 0,
    classesList: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, performanceRes] = await Promise.all([
          axios.get('/classes/teacher'),
          axios.get('/analytics/teacher/performance')
        ]);

        const classes = classesRes.data.classes;
        const performance = performanceRes.data;

        const totalStudents = classes.reduce((acc: number, cls: { student_count: number }) => acc + (cls.student_count || 0), 0);
        const classesList = classes.map((c: { name: string }) => c.name).slice(0, 3); // Show first 3 classes

        setStats({
          activeClasses: classes.length,
          totalStudents,
          averageScore: Math.round(performance.averageScore || 0),
          classesList
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('dashboard.welcome', { name: user?.name || 'Teacher' })}</h1>
      <p className="text-muted-foreground">{t('dashboard.description')}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacher.activeClasses')}</CardTitle>
            <CardDescription>{t('dashboard.teacher.activeClassesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl">{stats.activeClasses}</p>
            <p className="text-sm text-muted-foreground">
              {stats.classesList.length > 0 ? stats.classesList.join(', ') + (stats.activeClasses > 3 ? '...' : '') : t('common.none')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacher.totalStudents')}</CardTitle>
            <CardDescription>{t('dashboard.teacher.totalStudentsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl">{stats.totalStudents}</p>
            {/* New students metric not available in current API, hiding or using placeholder logic if needed */}
            {/* <p className="text-sm text-muted-foreground">{t('dashboard.teacher.newStudentsThisWeek', { count: 0 })}</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacher.overallPerformance')}</CardTitle>
            <CardDescription>{t('dashboard.teacher.overallPerformanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl">{stats.averageScore}%</p>
            {/* Score change not available in current API */}
            {/* <p className="text-sm text-muted-foreground">{t('dashboard.teacher.scoreChange', { percent: 0 })}</p> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
