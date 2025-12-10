'use client';

import { ClassManagement } from "@/components/teacher/class-management";

export default function TeacherClasses() {
  return (
    <div className="flex flex-col gap-4">
      <ClassManagement />
    </div>
  );
}