import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus } from "lucide-react";
import React from "react";
import { Locale } from '@/i18n-config';
import { getDictionary } from "@/get-dictionary";

export default async function TeacherLayout({ 
  children,
  params: { lang }
}: { 
  children: React.ReactNode,
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang);

  const teacherNavItems = [
    { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "groups", label: "Student Groups", icon: Users },
    { href: "create", label: "Create Path", icon: BookPlus },
  ];
  
  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher" lang={lang}>
      {children}
    </DashboardLayout>
  );
}
