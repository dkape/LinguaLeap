'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Loader2 } from "lucide-react";
import axios from 'axios';

interface Achievement {
  id: string;
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  unlocked: boolean;
}

export default function StudentAchievements() {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('/achievements');
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
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
      <h1 className="text-2xl font-bold">{t('student.achievements.title')}</h1>
      <p className="text-muted-foreground">{t('student.achievements.description')}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, index) => (
          <Card key={index} className={!achievement.unlocked ? 'opacity-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{achievement.titleKey ? t(achievement.titleKey) : achievement.title}</CardTitle>
                <CardDescription>{achievement.descriptionKey ? t(achievement.descriptionKey) : achievement.description}</CardDescription>
              </div>
              <Trophy className={`h-8 w-8 ${achievement.unlocked ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}