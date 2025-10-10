// This component is now a client component
'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, BookOpen, Rocket, Castle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Course } from "@/lib/types";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const iconMap: { [key: string]: React.ElementType } = {
  Rocket: Rocket,
  Castle: Castle,
  BookOpen: BookOpen,
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, "courses");
        const courseSnapshot = await getDocs(coursesCollection);
        const coursesList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        
        // This is a temporary solution to map icon names to components
        const coursesWithIcons = coursesList.map(course => ({
          ...course,
          icon: iconMap[course.icon as string] || BookOpen
        }));

        setCourses(coursesWithIcons);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading || !user) {
    return <div>Loading...</div>;
  }
  
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
        {loading ? (
          <p>Loading courses...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
