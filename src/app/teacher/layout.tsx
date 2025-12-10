import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, Users, BookPlus, UserCheck } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";

// Disable static generation for this layout
export const dynamic = 'force-dynamic';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const { t } = useTranslation();

  const teacherNavItems = [
    { href: "/teacher/dashboard", label: t('navigation.dashboard'), icon: LayoutDashboard },
    { href: "/teacher/groups", label: t('navigation.studentGroups'), icon: Users },
    { href: "/teacher/create", label: t('navigation.createPath'), icon: BookPlus },
    { href: "/teacher/students", label: t('navigation.studentProgress'), icon: UserCheck },
  ];
  
  return (
    <DashboardLayout navItems={teacherNavItems}>
      {children}
    </DashboardLayout>
  );
}
