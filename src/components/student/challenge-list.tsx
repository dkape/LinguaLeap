'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, BookText, Play, CheckCircle, Users } from 'lucide-react';
import { useTranslation } from '@/contexts/locale-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/locale-context';
import axios from 'axios';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  topic: string;
  language: 'de' | 'en';
  ageRange: string;
  readingLevel: string;
  class_name: string;
  teacher_name: string;
  totalPoints: number;
  timeLimitMinutes: number;
  total_items: number;
  completed_items: number;
  attempt_status: 'not_started' | 'in_progress' | 'completed' | 'abandoned' | null;
  total_points_earned: number;
  total_time_spent_seconds: number;
  started_at: string | null;
  completed_at: string | null;
  createdAt: string;
}

export function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress'>('all');
  const { t } = useTranslation();

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return challenge.attempt_status === 'in_progress';
    return true;
  });

  const router = useRouter();
  const { locale } = useLocale();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/challenges/student');
      setChallenges(response.data.challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startChallenge = async (challengeId: string) => {
    try {
      const response = await axios.post(`/challenges/${challengeId}/start`);
      const attemptId = response.data.attemptId;
      // TODO: Create this page
      router.push(`/${locale}/student/challenge/${attemptId}`);
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const continueChallenge = (challengeId: string) => {
    // Find the attempt ID and continue
    // For now, assuming we navigate to the same page, but we might need to fetch the attempt ID if not available
    // But wait, if status is in_progress, we probably have an attempt.
    // The API response for student challenges doesn't explicitly return attemptId, but we can probably find it or the start endpoint handles it.
    // Actually, startChallenge endpoint checks for existing attempt and returns it if it exists.
    startChallenge(challengeId);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'abandoned':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'completed':
        return t('challenges.completed');
      case 'in_progress':
        return t('challenges.inProgress');
      case 'abandoned':
        return t('challenges.abandoned');
      default:
        return t('challenges.notStarted');
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('challenges.myChallenges')}</h2>
        <p className="text-muted-foreground">
          {t('challenges.solveChallengesDescription')}
        </p>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('challenges.noChallenges')}</h3>
            <p className="text-muted-foreground">
              {t('challenges.noChallengesDescription')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <div className="flex gap-4 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              {t('challenges.allChallenges')}
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'outline'}
              onClick={() => setFilter('in_progress')}
            >
              {t('challenges.inProgress')}
            </Button>
          </div>

          {filteredChallenges.map((challenge) => {
            const progress = challenge.total_items > 0
              ? (challenge.completed_items / challenge.total_items) * 100
              : 0;

            return (
              <Card
                key={challenge._id}
                className={cn(
                  "hover:shadow-md transition-shadow"
                )}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{challenge.class_name} • {challenge.teacher_name}</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(challenge.attempt_status)} text-white`}
                    >
                      {getStatusText(challenge.attempt_status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      <Trophy className="mr-1 h-3 w-3" />
                      {challenge.totalPoints} {t('common.points')}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      ~{challenge.timeLimitMinutes} {t('common.minutes')}
                    </Badge>
                    <Badge variant="outline">
                      <BookText className="mr-1 h-3 w-3" />
                      {challenge.total_items} {t('common.tasks')}
                    </Badge>
                    <Badge variant="outline">
                      {challenge.topic}
                    </Badge>
                  </div>

                  {challenge.attempt_status && challenge.attempt_status !== 'not_started' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('challenges.progress')}</span>
                        <span>{challenge.completed_items}/{challenge.total_items} {t('common.tasks')}</span>
                      </div>
                      <Progress value={progress} className="h-2" />

                      {challenge.attempt_status === 'completed' && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{t('challenges.pointsEarned')}: {challenge.total_points_earned}</span>
                          <span>{t('challenges.time')}: {formatTime(challenge.total_time_spent_seconds)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {challenge.attempt_status === 'completed' ? (
                      <Button variant="outline" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t('challenges.completed')}
                      </Button>
                    ) : challenge.attempt_status === 'in_progress' ? (
                      <Button onClick={() => continueChallenge(challenge._id)}>
                        <Play className="mr-2 h-4 w-4" />
                        {t('challenges.continue')}
                      </Button>
                    ) : (
                      <Button onClick={() => startChallenge(challenge._id)}>
                        <Play className="mr-2 h-4 w-4" />
                        {t('challenges.start')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}