
'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus } from "lucide-react";
import React from "react";
import { useDictionary } from "@/hooks/use-dictionary";

export default function TeacherLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const { dictionary } = useDictionary();

  const teacherNavItems = [
    { href: "/teacher/dashboard", label: dictionary.teacher.nav.dashboard, icon: LayoutDashboard },
    { href: "/teacher/groups", label: dictionary.teacher.nav.groups, icon: Users },
    { href: "/teacher/create", label: dictionary.teacher.nav.create, icon: BookPlus },
  ];
  
  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      {children}
    </DashboardLayout>
  );
}
