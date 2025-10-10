'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Trophy } from "lucide-react";
import React from "react";

export default function StudentLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const studentNavItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      {children}
    </DashboardLayout>
  );
}
