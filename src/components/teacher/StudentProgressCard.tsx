import { Student } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StudentProgressCardProps {
  student: Student;
}

export function StudentProgressCard({ student }: StudentProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Current Lesson: {student.currentLesson}</p>
        <Progress value={student.progress} />
      </CardContent>
    </Card>
  );
}
