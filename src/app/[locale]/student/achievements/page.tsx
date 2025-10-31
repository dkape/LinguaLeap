'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const achievements = [
  { title: "First Challenge", description: "Complete your first challenge.", unlocked: true },
  { title: "5 Challenges", description: "Complete 5 challenges.", unlocked: true },
  { title: "10 Challenges", description: "Complete 10 challenges.", unlocked: false },
  { title: "High Scorer", description: "Get a score of 90% or higher.", unlocked: true },
  { title: "Speed Reader", description: "Complete a challenge in under 2 minutes.", unlocked: false },
  { title: "Perfect Score", description: "Get a perfect score on a challenge.", unlocked: false },
];

export default function StudentAchievements() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('achievements.title')}</h1>
      <p className="text-muted-foreground">{t('achievements.description')}</p>
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