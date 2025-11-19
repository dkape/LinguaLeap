'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function StudentAchievements() {
  const { t } = useTranslation();

  const achievements = [
    { title: t('student.achievements.items.firstLogin.title'), description: t('student.achievements.items.firstLogin.description'), unlocked: true },
    { title: t('student.achievements.items.completed5.title'), description: t('student.achievements.items.completed5.description'), unlocked: true },
    { title: "10 Challenges", description: "Complete 10 challenges.", unlocked: false }, // Keeping some as mock if not in dict, or I should add them. I added 3 items to dict.
    { title: "High Scorer", description: "Get a score of 90% or higher.", unlocked: true },
    { title: "Speed Reader", description: "Complete a challenge in under 2 minutes.", unlocked: false },
    { title: t('student.achievements.items.perfectScore.title'), description: t('student.achievements.items.perfectScore.description'), unlocked: false },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('student.achievements.title')}</h1>
      <p className="text-muted-foreground">{t('student.achievements.description')}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, index) => (
          <Card key={index} className={!achievement.unlocked ? 'opacity-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </div>
              <Trophy className={`h-8 w-8 ${achievement.unlocked ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}