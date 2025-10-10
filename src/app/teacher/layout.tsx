'use client';
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus } from "lucide-react";
import React from "react";
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n-config';

const teacherNavItems = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "groups", label: "Student Groups", icon: Users },
  { href: "create", label: "Create Path", icon: BookPlus },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const navItems = teacherNavItems;
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as Locale;
  
  return (
    <DashboardLayout navItems={navItems} role="teacher" lang={lang}>
      {children}
    </DashboardLayout>
  );
}
