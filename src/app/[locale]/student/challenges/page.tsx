'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentChallenges() {
  const { t } = useTranslation();

  const challenges = [
    {
      title: "The Adventures of Tom Sawyer - Chapter 1",
      description: "Read the first chapter and answer the questions.",
      status: "notStarted",
    },
    {
      title: "Alice in Wonderland - A Mad Tea-Party",
      description: "Join the Mad Hatter for a tea party.",
      status: "inProgress",
    },
    {
      title: "The Jungle Book - Mowgli's Brothers",
      description: "Learn how Mowgli was raised by wolves.",
      status: "completed",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('student.challenges.title')}</h1>
      <p className="text-muted-foreground">{t('student.challenges.description')}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {t(`student.challenges.${challenge.status}`)}
              </span>
              <Button disabled={challenge.status !== 'notStarted'}>
                {t('student.challenges.start')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}