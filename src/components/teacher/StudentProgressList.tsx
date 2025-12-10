import { Student } from "@/lib/types";
import { StudentProgressCard } from "./StudentProgressCard";

const students: Student[] = [
  { id: "1", name: "John Doe", currentLesson: "Lesson 5", progress: 50 },
  { id: "2", name: "Jane Smith", currentLesson: "Lesson 3", progress: 75 },
  { id: "3", name: "Peter Jones", currentLesson: "Lesson 8", progress: 25 },
];

export function StudentProgressList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => (
        <StudentProgressCard key={student.id} student={student} />
      ))}
    </div>
  );
}
