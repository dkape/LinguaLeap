'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import type { Course, Level } from '@/lib/types';

export default function QuizPage({ params }: { params: { courseId: string, levelId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [formSchema, setFormSchema] = useState<z.ZodObject<any> | null>(null);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const courseDocRef = doc(db, 'courses', params.courseId);
        const courseDoc = await getDoc(courseDocRef);

        if (courseDoc.exists()) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
          setCourse(courseData);
          const levelData = courseData.levels.find(l => l.id === params.levelId);

          if (levelData) {
            setLevel(levelData);
            const schema = z.object(
              Object.fromEntries(
                levelData.quiz.map((_, index) => [`q${index}`, z.string().min(1, "Please select an answer.")])
              )
            );
            setFormSchema(schema);
          } else {
            notFound();
          }
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLevel();
  }, [params.courseId, params.levelId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!level || !user) return;
    
    let correctAnswers = 0;
    level.quiz.forEach((q, index) => {
      if (values[`q${index}` as keyof typeof values] === q.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setSubmitted(true);

    const pointsEarned = correctAnswers * 25;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
        points: increment(pointsEarned)
    });
  }

  if (loading || !formSchema) {
    return <div>Loading quiz...</div>;
  }
  
  if (!level || !course) {
      notFound();
  }

  if (submitted) {
    const pointsEarned = score * 25;
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <Trophy className="mx-auto h-16 w-16 text-amber-400" />
                    <CardTitle className="text-2xl font-bold font-headline mt-4">Quiz Complete!</CardTitle>
                    <CardDescription>You've earned {pointsEarned} points!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{score} / {level.quiz.length}</p>
                    <p className="text-muted-foreground">Correct Answers</p>
                </CardContent>
                <CardFooter>
                    <Link href={`/student/courses/${course.id}`} className="w-full">
                        <Button className="w-full">
                            Back to Course <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-2">Quiz: {level.title}</h1>
        <p className="text-muted-foreground mb-6">Test your knowledge and earn points!</p>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {level.quiz.map((q, index) => (
            <FormField
                key={index}
                control={form.control}
                name={`q${index}` as any}
                render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold">{index + 1}. {q.question}</FormLabel>
                    <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                    >
                        {q.options.map((option, optionIndex) => (
                            <FormItem key={optionIndex} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                                <FormControl>
                                    <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            ))}
            <Button type="submit" size="lg">Submit Quiz</Button>
        </form>
        </Form>
    </div>
  );
}
