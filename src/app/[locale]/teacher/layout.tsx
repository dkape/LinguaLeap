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
    { href: "/teacher/dashboard", label: t('navigation.dashboard'), icon: LayoutDashboard },
    { href: "/teacher/classes", label: t('navigation.classes'), icon: Users },
    { href: "/teacher/challenges", label: t('navigation.challenges'), icon: Target },
    { href: "/teacher/learning-paths", label: t('navigation.learningPaths'), icon: BookPlus },
    { href: "/teacher/analytics", label: t('navigation.analytics'), icon: BarChart },
    { href: "/teacher/settings", label: t('navigation.settings'), icon: Settings }
  ];
  
  return (
    <DashboardLayout navItems={teacherNavItems}>
      {children}
    </DashboardLayout>
  );
}