'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, BookText, Play, CheckCircle, Users, Sparkles } from 'lucide-react';
import { useTranslation } from '@/contexts/locale-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/locale-context';
import axios from 'axios';

interface Challenge {
  id: number;
  title: string;
  description: string;
  topic: string;
  language: 'de' | 'en';
  age_range: string;
  reading_level: string;
  class_name: string;
  teacher_name: string;
  total_points: number;
  time_limit_minutes: number;
  total_items: number;
  completed_items: number;
  attempt_status: 'not_started' | 'in_progress' | 'completed' | 'abandoned' | null;
  total_points_earned: number;
  total_time_spent_seconds: number;
  started_at: string | null;
  completed_at: string | null;
  createdAt: string;
  difficulty_level: 1 | 2 | 3;
  tags: string[];
  estimated_completion_time: number;
  recommended: boolean;
  next_milestone: {
    type: string;
    points_needed: number;
  };
}

export function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'recommended'>('all');
  const { t } = useTranslation();

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return challenge.attempt_status === 'in_progress';
    if (filter === 'recommended') return challenge.recommended;
    return true;
  });

  const getDifficultyBadge = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={colors[level as 1 | 2 | 3]}>
        {t(`challenges.difficulty.${level}`)}
      </Badge>
    );
  };
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

  const startChallenge = async (challengeId: number) => {
    try {
      const response = await axios.post(`/challenges/${challengeId}/start`);
      const attemptId = response.data.attemptId;
      router.push(`/${locale}/student/challenge/${attemptId}`);
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const continueChallenge = (challengeId: number) => {
    // Find the attempt ID and continue
    router.push(`/${locale}/student/challenge/${challengeId}`);
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
        return 'Abgeschlossen';
      case 'in_progress':
        return 'In Bearbeitung';
      case 'abandoned':
        return 'Abgebrochen';
      default:
        return 'Nicht begonnen';
    }
  };

  const formatTime = (seconds: number) => {
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
        <h2 className="text-2xl font-bold mb-2">Meine Herausforderungen</h2>
        <p className="text-muted-foreground">
          Löse spannende Lese-Herausforderungen und sammle Punkte!
        </p>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keine Herausforderungen verfügbar</h3>
            <p className="text-muted-foreground">
              Dein Lehrer hat noch keine Herausforderungen für deine Klasse erstellt.
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
            <Button
              variant={filter === 'recommended' ? 'default' : 'outline'}
              onClick={() => setFilter('recommended')}
            >
              {t('challenges.recommended')}
            </Button>
          </div>

          {filteredChallenges.map((challenge) => {
            const progress = challenge.total_items > 0 
              ? (challenge.completed_items / challenge.total_items) * 100 
              : 0;

            return (
              <Card 
                key={challenge.id} 
                className={cn(
                  "hover:shadow-md transition-shadow",
                  challenge.recommended && "border-2 border-primary"
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
                      {challenge.total_points} Punkte
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      ~{challenge.estimated_completion_time} Min
                    </Badge>
                    {getDifficultyBadge(challenge.difficulty_level)}
                    {challenge.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-800">
                        {tag}
                      </Badge>
                    ))}
                    {challenge.recommended && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        <Sparkles className="mr-1 h-3 w-3" />
                        {t('challenges.recommended')}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <BookText className="mr-1 h-3 w-3" />
                      {challenge.total_items} Aufgaben
                    </Badge>
                    <Badge variant="outline">
                      {challenge.topic}
                    </Badge>
                  </div>

                  {challenge.attempt_status && challenge.attempt_status !== 'not_started' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fortschritt</span>
                        <span>{challenge.completed_items}/{challenge.total_items} Aufgaben</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      {challenge.attempt_status === 'completed' && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Erreichte Punkte: {challenge.total_points_earned}</span>
                          <span>Zeit: {formatTime(challenge.total_time_spent_seconds)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {challenge.attempt_status === 'completed' ? (
                      <Button variant="outline" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Abgeschlossen
                      </Button>
                    ) : challenge.attempt_status === 'in_progress' ? (
                      <Button onClick={() => continueChallenge(challenge.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Fortsetzen
                      </Button>
                    ) : (
                      <Button onClick={() => startChallenge(challenge.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Starten
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