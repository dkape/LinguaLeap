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
    { href: "/student/dashboard", label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: "/student/challenges", label: t('nav.challenges'), icon: Target },
    { href: "/student/progress", label: t('nav.progress'), icon: BookOpen },
    { href: "/student/achievements", label: t('nav.achievements'), icon: Trophy },
    { href: "/student/leaderboard", label: t('nav.leaderboard'), icon: Star },
    { href: "/student/settings", label: t('nav.settings'), icon: Settings }
  ];
  
  return (
    <DashboardLayout navItems={studentNavItems}>
      {children}
    </DashboardLayout>
  );
}