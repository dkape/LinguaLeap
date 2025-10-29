'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, Target, BookPlus, BarChart, Settings } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";
import React from "react";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  
  const teacherNavItems = [
    { href: "/teacher/dashboard", label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: "/teacher/classes", label: t('nav.classes'), icon: Users },
    { href: "/teacher/challenges", label: t('nav.challenges'), icon: Target },
    { href: "/teacher/learning-paths", label: t('nav.learningPaths'), icon: BookPlus },
    { href: "/teacher/analytics", label: t('nav.analytics'), icon: BarChart },
    { href: "/teacher/settings", label: t('nav.settings'), icon: Settings }
  ];
  
  return (
    <DashboardLayout navItems={teacherNavItems}>
      {children}
    </DashboardLayout>
  );
}