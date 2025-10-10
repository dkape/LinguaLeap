'use client';
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Trophy } from "lucide-react";
import React from "react";
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { getDictionary } from "@/get-dictionary";
import { useEffect, useState } from "react";

export default function StudentLayout({ 
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
