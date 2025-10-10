import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus } from "lucide-react";
import React from "react";

const teacherNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/groups", label: "Student Groups", icon: Users },
  { href: "/create", label: "Create Path", icon: BookPlus },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  // A placeholder for future pages
  const navItems = teacherNavItems;
  
  return (
    <DashboardLayout navItems={navItems} role="teacher">
      {children}
    </DashboardLayout>
  );
}
