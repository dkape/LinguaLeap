'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Challenge 1', score: 80, time: 120 },
  { name: 'Challenge 2', score: 95, time: 110 },
  { name: 'Challenge 3', score: 75, time: 130 },
  { name: 'Challenge 4', score: 88, time: 115 },
  { name: 'Challenge 5', score: 92, time: 105 },
];

export default function StudentProgress() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('student.progress.title')}</h1>
      <p className="text-muted-foreground">{t('student.progress.description')}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('student.progress.challengeScores')}</CardTitle>
            <CardDescription>{t('student.progress.challengeScoresDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('student.progress.completionTime')}</CardTitle>
            <CardDescription>{t('student.progress.completionTimeDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="time" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}