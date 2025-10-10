
'use client';

import { Logo } from "@/components/icons";
import Link from "next/link";
import { useDictionary } from "@/hooks/use-dictionary";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dictionary } = useDictionary();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold">{dictionary.brand.name}</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
