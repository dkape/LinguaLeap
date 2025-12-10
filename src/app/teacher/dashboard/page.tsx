'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLearningPathForm } from "@/components/teacher/create-learning-path-form";
import { BookCopy, GraduationCap, Users as UsersIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/contexts/locale-context";
import { t } from "@/lib/dictionaries";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { dict } = useLocale();

  if (!user) {
    return <div>{t(dict, 'common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t(dict, 'dashboard.welcome')}, {user.name}!</h1>
        <p className="text-muted-foreground">{t(dict, 'dashboard.teacher.description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t(dict, 'dashboard.teacher.students')}</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground">{t(dict, 'dashboard.teacher.inClasses', { count: 3 })}</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t(dict, 'dashboard.teacher.courses')}</CardTitle>
                  <BookCopy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">5</div>
                   <p className="text-xs text-muted-foreground">{t(dict, 'dashboard.teacher.created')} 5 {t(dict, 'common.thisMonth')}</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t(dict, 'dashboard.teacher.classes')}</CardTitle>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+{t(dict, 'common.newThisWeek', { count: 1 })}</p>
              </CardContent>
          </Card>
      </div>

      <CreateLearningPathForm />
    </div>
  );
}
