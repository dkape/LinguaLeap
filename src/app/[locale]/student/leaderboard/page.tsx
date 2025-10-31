'use client';

import { useTranslation } from "@/contexts/locale-context";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const leaderboardData = [
  { rank: 1, name: "Alice", score: 1250, challenges: 15 },
  { rank: 2, name: "Bob", score: 1180, challenges: 14 },
  { rank: 3, name: "Charlie", score: 1100, challenges: 13 },
  { rank: 4, name: "David", score: 1050, challenges: 12 },
  { rank: 5, name: "You", score: 980, challenges: 12 },
  { rank: 6, name: "Eve", score: 950, challenges: 11 },
  { rank: 7, name: "Frank", score: 900, challenges: 10 },
];

export default function StudentLeaderboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('leaderboard.title')}</h1>
      <p className="text-muted-foreground">{t('leaderboard.description')}</p>
      <Card>
        <CardHeader>
          <CardTitle>Class 3A Leaderboard</CardTitle>
          <CardDescription>See how you rank against your classmates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Challenges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((row) => (
                <TableRow key={row.rank} className={row.name === 'You' ? 'bg-muted' : ''}>
                  <TableCell className="font-medium">{row.rank}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.challenges}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
