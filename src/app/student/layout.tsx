
'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Trophy } from "lucide-react";
import React from "react";
import { useDictionary } from "@/hooks/use-dictionary";

export default function StudentLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const { dictionary } = useDictionary();

  const studentNavItems = [
    { href: "/student/dashboard", label: dictionary.student.nav.dashboard, icon: LayoutDashboard },
    { href: "/student/leaderboard", label: dictionary.student.nav.leaderboard, icon: Trophy },
  ];

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      {children}
    </DashboardLayout>
  );
}
