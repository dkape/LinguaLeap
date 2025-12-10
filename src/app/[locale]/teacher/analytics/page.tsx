'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Loader2 } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ClassData {
  name: string;
  avgScore: number;
  completionRate: number;
}

interface StudentPerformance {
  name: string;
  value: number;
}

export default function TeacherAnalytics() {
  const { t } = useTranslation();
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/analytics/teacher/analytics');
        setClassData(response.data.classData);
        setStudentPerformance(response.data.studentPerformance);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
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
      <h1 className="text-2xl font-bold">{t('teacher.analytics.title')}</h1>
      <p className="text-muted-foreground">{t('teacher.analytics.description')}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.analytics.classAverageScores')}</CardTitle>
            <CardDescription>{t('teacher.analytics.classAverageScoresDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {classData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgScore" fill="#8884d8" name={t('teacher.analytics.averageScore')} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  {t('common.noResults')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.analytics.studentPerformance')}</CardTitle>
            <CardDescription>{t('teacher.analytics.studentPerformanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {studentPerformance.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={studentPerformance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {studentPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  {t('common.noResults')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}