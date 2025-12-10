'use client';

import { CreateChallengeForm } from "@/components/teacher/create-challenge-form";

export default function TeacherChallenges() {
  return (
    <div className="flex flex-col gap-4">
      <CreateChallengeForm />
    </div>
  );
}