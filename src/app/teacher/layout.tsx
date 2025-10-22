'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus } from "lucide-react";
import React from "react";

// Disable static generation for this layout
export const dynamic = 'force-dynamic';

export default function TeacherLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const teacherNavItems = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    // { href: "/teacher/groups", label: "Student Groups", icon: Users }, // TODO: Create this page
    // { href: "/teacher/create", label: "Create Path", icon: BookPlus }, // TODO: Create this page
  ];
  
  return (
    <DashboardLayout navItems={teacherNavItems}>
      {children}
    </DashboardLayout>
  );
}
