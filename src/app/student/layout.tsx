'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useTranslation } from "@/contexts/locale-context";
import { LayoutDashboard, Trophy } from "lucide-react";

// Disable static generation for this layout
export const dynamic = 'force-dynamic';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const { t } = useTranslation();

  const studentNavItems = [
    { href: "/student/dashboard", label: t('navigation.dashboard'), icon: LayoutDashboard },
    { href: "/student/leaderboard", label: t('navigation.leaderboard'), icon: Trophy },
  ];

  return (
    <DashboardLayout navItems={studentNavItems}>
      {children}
    </DashboardLayout>
  );
}
