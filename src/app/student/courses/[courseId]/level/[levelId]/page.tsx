import { courses } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReadingPage({ params }: { params: { courseId: string, levelId: string } }) {
  const course = courses.find((c) => c.id === params.courseId);
  const level = course?.levels.find((l) => l.id === params.levelId);

  if (!course || !level || !level.unlocked) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
        <div className="flex-shrink-0 mb-4">
            <Link href={`/student/courses/${course.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to {course.title}
            </Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline">{level.title}</h1>
                <div className="flex items-center gap-2 text-xl font-bold text-amber-500">
                    <Star className="h-6 w-6"/>
                    <span>+50</span>
                </div>
            </div>
        </div>

        <Card className="flex-grow flex flex-col">
            <CardHeader>
                <CardTitle>Reading Text</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <ScrollArea className="flex-grow pr-4 -mr-4">
                    <article className="prose prose-lg max-w-none text-foreground/90">
                        {level.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </article>
                </ScrollArea>
            </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-end">
            <Link href={`/student/courses/${course.id}/level/${level.id}/quiz`}>
                <Button size="lg">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Finish Reading & Start Quiz
                </Button>
            </Link>
        </div>
    </div>
  );
}
