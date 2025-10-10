import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, BookCopy, Trophy } from "lucide-react";
import React from "react";

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      {children}
    </DashboardLayout>
  );
}
