'use client';

import Link from "next/link";
import { Logo } from "@/components/icons";
import { UserNav } from "@/components/shared/user-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";

type DashboardHeaderProps = {
  sidebarContent: React.ReactNode;
};

export function DashboardHeader({ sidebarContent }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <div className="flex h-full flex-col p-4">{sidebarContent}</div>
                </SheetContent>
            </Sheet>
        </div>
        <Link href="/" className="items-center gap-2 hidden md:flex">
          <Logo className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary">LinguaLeap</span>
        </Link>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
