'use client';
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, BookCopy, Trophy } from "lucide-react";
import React from "react";
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n-config';

const studentNavItems = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as Locale;
  return (
    <DashboardLayout navItems={studentNavItems} role="student" lang={lang}>
      {children}
    </DashboardLayout>
  );
}
