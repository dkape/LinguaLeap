'use client';
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { getDictionary } from "@/get-dictionary";

export default function TeacherLayout({ 
  children,
  params: { lang }
}: { 
  children: React.ReactNode,
  params: { lang: Locale }
}) {
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    fetchDictionary();
  }, [lang]);

  if (!dictionary) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }

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
