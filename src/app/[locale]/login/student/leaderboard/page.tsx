'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Trophy, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type LeaderboardEntry = {
    rank: number;
    student: User;
    points: number;
}

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("points", "desc"), limit(10));
            const querySnapshot = await getDocs(q);
            
            const leaderboardData: LeaderboardEntry[] = querySnapshot.docs.map((doc, index) => ({
                rank: index + 1,
                student: { id: doc.id, ...doc.data() } as User,
                points: doc.data().points || 0,
            }));

            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error("Error fetching leaderboard: ", error);
        } finally {
            setLoading(false);
        }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div>Loading leaderboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Trophy className="h-8 w-8 text-amber-500" />
        <div>
            <h1 className="text-3xl font-bold font-headline">Leaderboard</h1>
            <p className="text-muted-foreground">See who's at the top of the class!</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Top Readers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry) => (
                <TableRow key={entry.student.id} className={cn(currentUser && entry.student.id === currentUser.id && "bg-primary/10")}>
                  <TableCell className="font-bold text-lg text-center">
                    {entry.rank === 1 && '🥇'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                    {entry.rank > 3 && entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.student.avatarUrl} alt={entry.student.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{entry.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{entry.student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-1 text-amber-500">
                        <Star className="h-4 w-4" />
                        {entry.points.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
