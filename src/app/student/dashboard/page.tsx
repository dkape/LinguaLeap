import Link from "next/link";
import { courses, users } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, Lock } from "lucide-react";

export default function StudentDashboard() {
  const user = users['student-1'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Ready for a new reading adventure?</p>
        </div>
        <Card className="w-full md:w-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{user.points?.toLocaleString() ?? 0}</div>
            </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">My Courses</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => {
            const unlockedLevels = course.levels.filter(l => l.unlocked).length;
            const totalLevels = course.levels.length;
            const progress = totalLevels > 0 ? (unlockedLevels / totalLevels) * 100 : 0;
            const CourseIcon = course.icon;
            
            return (
              <Card key={course.id} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <CourseIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Progress: {unlockedLevels} / {totalLevels} levels</p>
                    <Progress value={progress} aria-label={`${progress}% complete`} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/student/courses/${course.id}`} className="w-full">
                    <Button className="w-full">
                      Continue Learning
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
