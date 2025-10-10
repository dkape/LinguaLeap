'use client';
import React from "react";
import { DashboardHeader } from "./header";
import { Logo } from "../icons";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: React.ReactNode;
  navItems: { href: string; label: string; icon: React.ElementType }[];
  role: 'student' | 'teacher';
};

export function DashboardLayout({ children, navItems, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <Logo className="h-7 w-7" />
          <span className="text-xl font-bold">LinguaLeap</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                    isActive && "bg-muted text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-card lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {sidebarContent}
        </div>
      </aside>
      <div className="flex flex-col">
        <DashboardHeader sidebarContent={sidebarContent} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
