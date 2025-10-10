
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLearningPathForm } from "@/components/teacher/create-learning-path-form";
import { BookCopy, GraduationCap, Users as UsersIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDictionary } from "@/hooks/use-dictionary";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { dictionary } = useDictionary();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">{dictionary.teacher.title.replace('{name}', user.name)}</h1>
        <p className="text-muted-foreground">{dictionary.teacher.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{dictionary.teacher.dashboard.totalStudents}</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground">{dictionary.teacher.dashboard.studentsInGroups.replace('{count}', '3')}</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{dictionary.teacher.dashboard.activeCourses}</CardTitle>
                  <BookCopy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">5</div>
                   <p className="text-xs text-muted-foreground">{dictionary.teacher.dashboard.coursesThisMonth.replace('{count}', '5')}</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{dictionary.teacher.dashboard.studentGroups}</CardTitle>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">{dictionary.teacher.dashboard.newGroupsThisWeek.replace('{count}', '1')}</p>
              </CardContent>
          </Card>
      </div>

      <CreateLearningPathForm />
    </div>
  );
}
