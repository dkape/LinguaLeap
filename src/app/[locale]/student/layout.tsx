'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Target, Trophy, BookOpen, Star, Settings } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";
import React from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  
  const studentNavItems = [
    { href: "/student/dashboard", label: t('navigation.dashboard'), icon: LayoutDashboard },
    { href: "/student/challenges", label: t('navigation.challenges'), icon: Target },
    { href: "/student/progress", label: t('navigation.progress'), icon: BookOpen },
    { href: "/student/achievements", label: t('navigation.achievements'), icon: Trophy },
    { href: "/student/leaderboard", label: t('navigation.leaderboard'), icon: Star },
    { href: "/student/settings", label: t('navigation.settings'), icon: Settings }
  ];
  
  return (
    <DashboardLayout navItems={studentNavItems}>
      {children}
    </DashboardLayout>
  );
}