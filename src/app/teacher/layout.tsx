'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus } from "lucide-react";
import React from "react";

export default function TeacherLayout({ 
  children,
}: { 
  children: React.ReactNode,
}) {
  const teacherNavItems = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/groups", label: "Student Groups", icon: Users },
    { href: "/teacher/create", label: "Create Path", icon: BookPlus },
  ];
  
  return (
    <DashboardLayout navItems={teacherNavItems}>
      {children}
    </DashboardLayout>
  );
}
