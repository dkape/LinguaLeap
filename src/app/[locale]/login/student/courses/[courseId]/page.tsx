'use client';

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Lock, PlayCircle, Rocket, Castle } from "lucide-react";
import type { Course } from "@/lib/types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const iconMap: { [key: string]: React.ElementType } = {
  Rocket: Rocket,
  Castle: Castle,
  BookOpen: BookOpen,
};

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDocRef = doc(db, 'courses', params.courseId);
        const courseDoc = await getDoc(courseDocRef);

        if (courseDoc.exists()) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
          courseData.icon = iconMap[courseData.icon as string] || BookOpen;
          setCourse(courseData);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [params.courseId]);

  if (loading) {
    return <div>Loading course...</div>;
  }

  if (!course) {
    notFound();
  }

  const CourseIcon = course.icon;

  return (
    <div className="space-y-6">
      <Link href="/student/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
      
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-lg bg-primary/10 text-primary">
            <CourseIcon className="h-8 w-8" />
        </div>
        <div>
            <h1 className="text-3xl font-bold font-headline">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline">Levels</h2>
        <div className="grid gap-4">
          {course.levels.map((level, index) => (
            <Card key={level.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xl">{index + 1}</div>
                    <div>
                        <CardTitle>{level.title}</CardTitle>
                        <CardDescription>
                            {level.unlocked ? `Quiz with ${level.quiz.length} questions` : 'Complete previous levels to unlock'}
                        </CardDescription>
                    </div>
                </div>
                {level.unlocked ? (
                  <Link href={`/student/courses/${course.id}/level/${level.id}`}>
                    <Button size="icon" aria-label={`Start level ${level.title}`}>
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="icon" disabled>
                    <Lock className="h-5 w-5" />
                  </Button>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
