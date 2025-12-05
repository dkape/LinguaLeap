'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Trophy, Medal, Award, Clock, Target } from 'lucide-react';

import { useTranslation } from '@/contexts/locale-context';
import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  total_points: number;
  completed_challenges: number;
  avg_completion_time: number;
  rank_position: number;
}

interface StudentClass {
  id: string;
  name: string;
  teacher_name: string;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    fetchStudentClasses();
  }, [fetchStudentClasses]);

  useEffect(() => {
    if (selectedClassId) {
      fetchLeaderboard(selectedClassId);
    }
  }, [selectedClassId, fetchLeaderboard]);

  const fetchStudentClasses = useCallback(async () => {
    try {
      const response = await axios.get('/classes/student/my-classes');
      const studentClasses = response.data.classes.map((c: { _id: string; name: string; teacher?: { name: string } }) => ({
        id: c._id,
        name: c.name,
        teacher_name: c.teacher?.name || ''
      }));
      setClasses(studentClasses);

      // Auto-select first class
      if (studentClasses.length > 0) {
        setSelectedClassId(studentClasses[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching student classes:', error);
      setIsLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (classId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/challenges/class/${classId}/leaderboard`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isCurrentUser = (entryId: string) => {
    return user && user.id === entryId;
  };

  if (classes.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('leaderboard.noClasses')}</h3>
          <p className="text-muted-foreground">
            {t('leaderboard.noClassesDescription')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('leaderboard.title')}</h2>
        <p className="text-muted-foreground">
          {t('leaderboard.description')}
        </p>
      </div>

      {/* Class Selection */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {/* Timeframe buttons removed as backend doesn't support filtering yet */}
          </div>
          {/* Stat filter removed as backend returns all stats */}
        </div>

        <div className="flex flex-wrap gap-2">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2 rounded-lg border transition-colors ${selectedClassId === cls.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-border'
                }`}
            >
              {cls.name}
            </button>
          ))}
        </div>

      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('leaderboard.noResults')}</h3>
            <p className="text-muted-foreground">
              {t('leaderboard.noResultsDescription')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((entry) => (
            <Card
              key={entry.id}
              className={`transition-all ${isCurrentUser(entry.id)
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:shadow-md'
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
                    {entry.rank_position <= 3 ? (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankColor(entry.rank_position)}`}>
                        {getRankIcon(entry.rank_position)}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getRankIcon(entry.rank_position)}
                      </div>
                    )}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center space-x-3 flex-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`}
                      alt={entry.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className={`font-semibold ${isCurrentUser(entry.id) ? 'text-primary' : ''}`}>
                        {entry.name}
                        {isCurrentUser(entry.id) && (
                          <Badge variant="secondary" className="ml-2">{t('leaderboard.you')}</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {entry.completed_challenges} {t('leaderboard.completedChallenges')}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center text-yellow-600">
                        <Trophy className="h-4 w-4 mr-1" />
                        <span className="font-bold">{entry.total_points}</span>
                      </div>
                      <p className="text-muted-foreground">{t('leaderboard.points')}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center text-blue-600">
                        <Target className="h-4 w-4 mr-1" />
                        <span className="font-bold">{entry.completed_challenges}</span>
                      </div>
                      <p className="text-muted-foreground">{t('leaderboard.solved')}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center text-green-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="font-bold">{formatTime(entry.avg_completion_time)}</span>
                      </div>
                      <p className="text-muted-foreground">{t('leaderboard.avgTime')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}