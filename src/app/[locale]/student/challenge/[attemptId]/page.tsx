'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from "@/contexts/locale-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, Clock, BookOpen, HelpCircle } from "lucide-react";
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
    id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    points_value: number;
}

interface ChallengeItem {
    id: string;
    type: 'text' | 'quiz';
    title: string;
    content: string;
    order_index: number;
    progress_status: 'not_started' | 'reading' | 'completed';
    questions?: Question[];
}

interface ChallengeAttempt {
    id: string;
    challenge_title: string;
    challenge_description: string;
    status: string;
    total_points_earned: number;
    max_points: number;
}

export default function ChallengeAttemptPage() {
    const params = useParams();
    const router = useRouter();
    const { t } = useTranslation();
    const { toast } = useToast();
    const attemptId = params.attemptId as string;

    const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null);
    const [items, setItems] = useState<ChallengeItem[]>([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                const response = await axios.get(`/challenges/attempts/${attemptId}`);
                setAttempt(response.data.attempt);
                setItems(response.data.items);

                // Find first uncompleted item
                const firstUncompletedIndex = response.data.items.findIndex((item: ChallengeItem) => item.progress_status !== 'completed');
                if (firstUncompletedIndex !== -1) {
                    setCurrentItemIndex(firstUncompletedIndex);
                } else if (response.data.items.length > 0 && response.data.items.every((i: ChallengeItem) => i.progress_status === 'completed')) {
                    // All completed
                    setCurrentItemIndex(response.data.items.length - 1);
                }
            } catch (error) {
                console.error('Error fetching attempt:', error);
                toast({
                    variant: "destructive",
                    title: t('common.error'),
                    description: t('challenge.fetchError'),
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (attemptId) {
            fetchAttempt();
        }
    }, [attemptId, t, toast]);

    const handleStartReading = async (itemId: string) => {
        try {
            await axios.post(`/challenges/attempts/${attemptId}/items/${itemId}/start-reading`);
            // Update local state to reflect reading status if needed
        } catch (error) {
            console.error('Error starting reading:', error);
        }
    };

    const handleCompleteReading = async (itemId: string) => {
        setIsSubmitting(true);
        try {
            // Mock reading time and word count for now
            await axios.post(`/challenges/attempts/${attemptId}/items/${itemId}/complete-reading`, {
                reading_time_seconds: 60,
                word_count: 100
            });

            // Move to next item or refresh
            const updatedItems = [...items];
            updatedItems[currentItemIndex].progress_status = 'completed';
            setItems(updatedItems);

            if (currentItemIndex < items.length - 1) {
                setCurrentItemIndex(prev => prev + 1);
            } else {
                handleCompleteChallenge();
            }
        } catch (error) {
            console.error('Error completing reading:', error);
            toast({
                variant: "destructive",
                title: t('common.error'),
                description: t('challenge.submitError'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitQuiz = async (itemId: string) => {
        setIsSubmitting(true);
        try {
            const currentItem = items[currentItemIndex];
            if (!currentItem.questions) return;

            const answers = currentItem.questions.map(q => ({
                questionId: q.id,
                selectedAnswer: quizAnswers[q.id],
                timeSpent: 30 // Mock time
            }));

            await axios.post(`/challenges/attempts/${attemptId}/items/${itemId}/submit-quiz`, {
                answers
            });

            // Move to next item or refresh
            const updatedItems = [...items];
            updatedItems[currentItemIndex].progress_status = 'completed';
            setItems(updatedItems);
            setQuizAnswers({});

            if (currentItemIndex < items.length - 1) {
                setCurrentItemIndex(prev => prev + 1);
            } else {
                handleCompleteChallenge();
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            toast({
                variant: "destructive",
                title: t('common.error'),
                description: t('challenge.submitError'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteChallenge = async () => {
        try {
            await axios.post(`/challenges/attempts/${attemptId}/complete`);
            toast({
                title: t('common.success'),
                description: t('challenge.completedSuccess'),
            });
            router.push('/student/dashboard');
        } catch (error) {
            console.error('Error completing challenge:', error);
            // Even if it errors (e.g. already completed), redirect to dashboard
            router.push('/student/dashboard');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!attempt || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-muted-foreground">{t('challenge.notFound')}</p>
                <Button onClick={() => router.push('/student/dashboard')}>{t('common.backToDashboard')}</Button>
            </div>
        );
    }

    const currentItem = items[currentItemIndex];
    const progress = ((currentItemIndex) / items.length) * 100;

    return (
        <div className="container max-w-4xl py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{attempt.challenge_title}</h1>
                    <p className="text-muted-foreground">{attempt.challenge_description}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">15:00</span> {/* Timer placeholder */}
                    </div>
                    <Button variant="outline" onClick={() => router.push('/student/dashboard')}>
                        {t('common.exit')}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>{t('challenge.progress')}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        {currentItem.type === 'text' ? <BookOpen className="h-5 w-5 text-primary" /> : <HelpCircle className="h-5 w-5 text-primary" />}
                        <CardTitle>
                            {t('challenge.item')} {currentItemIndex + 1}: {currentItem.title}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentItem.type === 'text' ? (
                        <div className="prose max-w-none dark:prose-invert">
                            <p className="whitespace-pre-wrap">{currentItem.content}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-lg">{currentItem.content}</p>
                            {currentItem.questions?.map((q, index) => (
                                <Card key={q.id} className="border-secondary">
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            {index + 1}. {q.question}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            value={quizAnswers[q.id]}
                                            onValueChange={(val) => setQuizAnswers(prev => ({ ...prev, [q.id]: val }))}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="a" id={`q${q.id}-a`} />
                                                <Label htmlFor={`q${q.id}-a`}>{q.option_a}</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="b" id={`q${q.id}-b`} />
                                                <Label htmlFor={`q${q.id}-b`}>{q.option_b}</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="c" id={`q${q.id}-c`} />
                                                <Label htmlFor={`q${q.id}-c`}>{q.option_c}</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="d" id={`q${q.id}-d`} />
                                                <Label htmlFor={`q${q.id}-d`}>{q.option_d}</Label>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end">
                    {currentItem.type === 'text' ? (
                        <Button onClick={() => handleCompleteReading(currentItem.id)} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('challenge.markAsRead')}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleSubmitQuiz(currentItem.id)}
                            disabled={isSubmitting || (currentItem.questions && Object.keys(quizAnswers).length < currentItem.questions.length)}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('challenge.submitAnswers')}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
