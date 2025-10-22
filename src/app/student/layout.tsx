'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard } from "lucide-react";
import React from "react";

// Disable static generation for this layout
export const dynamic = 'force-dynamic';

export default function StudentLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const studentNavItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    // { href: "/student/leaderboard", label: "Leaderboard", icon: Trophy }, // TODO: Create this page
  ];

  return (
    <DashboardLayout navItems={studentNavItems}>
      {children}
    </DashboardLayout>
  );
}
