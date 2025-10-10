'use client';

import { useState } from 'react';
import { courses } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function QuizPage({ params }: { params: { courseId: string, levelId: string } }) {
  const router = useRouter();
  const course = courses.find((c) => c.id === params.courseId);
  const level = course?.levels.find((l) => l.id === params.levelId);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!course || !level) {
    notFound();
  }

  const formSchema = z.object(
    Object.fromEntries(
      level.quiz.map((_, index) => [`q${index}`, z.string().min(1, "Please select an answer.")])
    )
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let correctAnswers = 0;
    level.quiz.forEach((q, index) => {
      if (values[`q${index}` as keyof typeof values] === q.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setSubmitted(true);
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
