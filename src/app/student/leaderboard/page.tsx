import { leaderboard, users } from "@/lib/data";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Trophy, Star } from "lucide-react";

export default function LeaderboardPage() {
  const currentUser = users['student-1']; // Mock current user
  const avatarUrl = PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl;

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
                <TableRow key={entry.student.id} className={cn(entry.student.id === currentUser.id && "bg-primary/10")}>
                  <TableCell className="font-bold text-lg text-center">
                    {entry.rank === 1 && '🥇'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                    {entry.rank > 3 && entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl} alt={entry.student.name} data-ai-hint="person portrait" />
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
