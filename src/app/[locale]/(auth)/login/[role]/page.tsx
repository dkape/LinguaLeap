
import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";
import { Locale } from "@/i18n-config";

export default function LoginPage({ params }: { params: { role: string, lang: Locale }}) {
  const role = params.role as UserRole;

  if (role !== 'student' && role !== 'teacher') {
    return <div>Invalid role specified.</div>
  }

  return <AuthForm mode="login" role={role} lang={params.lang} />;
}
