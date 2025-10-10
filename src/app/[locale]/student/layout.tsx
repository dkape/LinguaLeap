
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Trophy } from "lucide-react";
import React from "react";
import { Locale } from '@/i18n-config';
import { getDictionary } from "@/get-dictionary";

export default async function StudentLayout({ 
  children,
  params: { lang }
}: { 
  children: React.ReactNode,
  params: { lang: Locale } 
}) {
  const dictionary = await getDictionary(lang);

  const studentNavItems = [
    { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <DashboardLayout navItems={studentNavItems} role="student" lang={lang}>
      {children}
    </DashboardLayout>
  );
}
