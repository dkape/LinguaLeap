import { AuthForm } from "@/components/auth/auth-form";
import { getDictionary, t } from "@/lib/dictionaries";
import type { UserRole } from "@/lib/types";
import { Locale } from "@/lib/i18n";

export const dynamic = 'force-dynamic';

type LoginPageProps = {
  params: Promise<{
    role: UserRole;
    locale: Locale;
  }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { role, locale } = await params;
  const dict = await getDictionary(locale);

  if (role !== 'student' && role !== 'teacher') {
    // Or handle this more gracefully, e.g., notFound() from next/navigation
    return <div>{t(dict, 'errors.invalidRole')}</div>
  }

  return <AuthForm mode="login" role={role} />;
}
