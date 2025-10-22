import { Logo } from "@/components/icons";
import Link from "next/link";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Logo className="h-8 w-8" />
              <span className="text-2xl font-bold">LinguaLeap</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
      <Toaster />
    </AuthProvider>
  );
}
