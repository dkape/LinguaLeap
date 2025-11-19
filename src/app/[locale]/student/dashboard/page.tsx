'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface Challenge {
  _id: string;
  title: string;
  attempt_status: string;
  total_points_earned: number;
  totalPoints: number;
  completed_at: string;
}

interface ClassData {
  _id: string;
  name: string;
}

interface LeaderboardEntry {
  id: string;
  rank_position: number;
}

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentChallenge, setRecentChallenge] = useState<Challenge | null>(null);
  const [stats, setStats] = useState({
    completedCount: 0,
    averageAccuracy: 0,
  });
  const [leaderboardRank, setLeaderboardRank] = useState<{ rank: number; className: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch challenges
        const challengesRes = await axios.get('/challenges/student');
        const challenges: Challenge[] = challengesRes.data.challenges;

        // Calculate stats
        const completedChallenges = challenges.filter(c => c.attempt_status === 'completed');
        const completedCount = completedChallenges.length;

        let totalAccuracy = 0;
        if (completedCount > 0) {
          const totalPointsEarned = completedChallenges.reduce((sum, c) => sum + (c.total_points_earned || 0), 0);
          const totalPossiblePoints = completedChallenges.reduce((sum, c) => sum + (c.totalPoints || 0), 0);
          if (totalPossiblePoints > 0) {
            totalAccuracy = Math.round((totalPointsEarned / totalPossiblePoints) * 100);
          }
        }

        setStats({
          completedCount,
          averageAccuracy: totalAccuracy,
        });

        // Find recent challenge (most recently completed or started)
        const sortedChallenges = [...challenges].sort((a, b) => {
          const dateA = a.completed_at || '0';
          const dateB = b.completed_at || '0';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        if (sortedChallenges.length > 0) {
          setRecentChallenge(sortedChallenges[0]);
        }

        // Fetch classes to get leaderboard
        const classesRes = await axios.get('/classes/student/my-classes');
        const classes: ClassData[] = classesRes.data.classes;

        if (classes.length > 0) {
          const primaryClass = classes[0];
          const leaderboardRes = await axios.get(`/challenges/class/${primaryClass._id}/leaderboard`);
          const leaderboard: LeaderboardEntry[] = leaderboardRes.data.leaderboard;

          const userRank = leaderboard.find(entry => entry.id === user?.id);
          if (userRank) {
            setLeaderboardRank({
              rank: userRank.rank_position,
              className: primaryClass.name
            });
          }
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('dashboard.welcome')}</h1>
      <p className="text-muted-foreground">{t('dashboard.description')}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.student.recentChallenge')}</CardTitle>
            <CardDescription>{t('dashboard.student.recentChallengeDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentChallenge ? (
              <>
                <p className="font-semibold">{recentChallenge.title}</p>
                <p className="text-sm text-muted-foreground">
                  {recentChallenge.attempt_status === 'completed'
                    ? t('dashboard.student.correctAnswers', {
                      correct: recentChallenge.total_points_earned,
                      total: recentChallenge.totalPoints
                    })
                    : t('challenges.notStarted') // You might need to add this key or use a generic one
                  }
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard.student.noRecentActivity')}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.student.currentProgress')}</CardTitle>
            <CardDescription>{t('dashboard.student.currentProgressDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{t('dashboard.student.challengesCompleted', { count: stats.completedCount })}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.student.averageAccuracy', { percent: stats.averageAccuracy })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.student.leaderboardRank')}</CardTitle>
            <CardDescription>{t('dashboard.student.leaderboardRankDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardRank ? (
              <>
                <p className="font-semibold">{t('dashboard.student.rankInClass', { rank: leaderboardRank.rank, class: leaderboardRank.className })}</p>
                {/* Top percent calculation would require total students in class, skipping for now or fetching it */}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard.student.noRank')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
