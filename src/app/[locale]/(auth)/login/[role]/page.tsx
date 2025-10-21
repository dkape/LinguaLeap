import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

type LoginPageProps = {
  params: Promise<{ role: UserRole; locale: Locale }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { role } = await params;
  
  if (role !== 'student' && role !== 'teacher') {
    return <div>Invalid role specified.</div>;
  }
  
  return <AuthForm mode="login" role={role} />;
}