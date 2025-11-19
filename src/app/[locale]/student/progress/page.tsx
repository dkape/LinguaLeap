'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface Challenge {
  _id: string;
  title: string;
  attempt_status: string;
  total_points_earned: number;
  total_time_spent_seconds: number;
}

export default function StudentProgress() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; score: number; time: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/challenges/student');
        const challenges: Challenge[] = response.data.challenges;

        const completedChallenges = challenges.filter(c => c.attempt_status === 'completed');

        const chartData = completedChallenges.map(c => ({
          name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
          fullName: c.title,
          score: c.total_points_earned || 0,
          time: c.total_time_spent_seconds || 0
        }));

        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('progress.title')}</h1>
      <p className="text-muted-foreground">{t('progress.description')}</p>

      {data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p>{t('challenges.noResultsDescription')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('progress.challengeScores')}</CardTitle>
              <CardDescription>{t('progress.challengeScoresDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" name={t('challenges.pointsEarned')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('progress.completionTime')}</CardTitle>
              <CardDescription>{t('progress.completionTimeDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" fill="#82ca9d" name={t('challenges.time')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}