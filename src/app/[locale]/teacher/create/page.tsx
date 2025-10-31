
'use client';

import { CreateLearningPathForm } from "@/components/teacher/create-learning-path-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CreatePathPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Learning Path</CardTitle>
        <CardDescription>Use our AI to generate a learning path for your students.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateLearningPathForm />
      </CardContent>
    </Card>
  );
}
