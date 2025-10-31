'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const learningPaths = [
  {
    title: "Beginner's Journey",
    description: "A sequence of 5 introductory challenges.",
    challenges: 5,
  },
  {
    title: "Advanced Adventures",
    description: "A collection of 10 difficult challenges for skilled readers.",
    challenges: 10,
  },
];

export default function TeacherLearningPaths() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('learningPaths.title')}</h1>
          <p className="text-muted-foreground">{t('learningPaths.description')}</p>
        </div>
        <Button>Create New Learning Path</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {learningPaths.map((path, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{path.title}</CardTitle>
              <CardDescription>{path.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">{path.challenges} challenges</span>
              <div>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}