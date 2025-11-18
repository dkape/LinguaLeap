'use client';

import Link from "next/link";
import { Logo } from "@/components/icons";
import { UserNav } from "@/components/shared/user-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu } from "lucide-react";
import React from "react";
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useLocale } from "@/contexts/locale-context";

type DashboardHeaderProps = {
  sidebarContent: React.ReactNode;
};

export function DashboardHeader({ sidebarContent }: DashboardHeaderProps) {
  const { locale } = useLocale();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="transition-all duration-200 hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex h-full flex-col">{sidebarContent}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo & Brand */}
        <Link 
          href="/" 
          className="items-center gap-2 hidden lg:flex group"
        >
          <div className="relative">
            <Logo className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:from-accent group-hover:to-primary">
            LinguaLeap
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher currentLocale={locale} />
          <UserNav />
          <div className="h-6 w-px bg-border hidden md:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
