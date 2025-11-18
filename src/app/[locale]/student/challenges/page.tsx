'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentChallenges() {
  const { dict } = useTranslation();
  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = dict;
    for (const k of keys) {
      result = result[k];
      if (typeof result === 'undefined') {
        return key;
      }
    }
    return result;
  };

  const challenges = [
    {
      title: "The Adventures of Tom Sawyer - Chapter 1",
      description: "Read the first chapter and answer the questions.",
      status: "Not Started",
    },
    {
      title: "Alice in Wonderland - A Mad Tea-Party",
      description: "Join the Mad Hatter for a tea party.",
      status: "In Progress",
    },
    {
      title: "The Jungle Book - Mowgli's Brothers",
      description: "Learn how Mowgli was raised by wolves.",
      status: "Completed",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('challenges.title')}</h1>
      <p className="text-muted-foreground">{t('challenges.description')}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">{challenge.status}</span>
              <Button disabled={challenge.status !== 'Not Started'}>Start</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}