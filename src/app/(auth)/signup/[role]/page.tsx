import { AuthForm } from "@/components/auth/auth-form";
import { getDictionary, t } from "@/lib/dictionaries";
import type { UserRole } from "@/lib/types";
import { Locale } from "@/lib/i18n";

export const dynamic = 'force-dynamic';

type SignupPageProps = {
  params: Promise<{
    role: UserRole;
    locale: Locale;
  }>;
};

export default async function SignupPage({ params }: SignupPageProps) {
  const { role, locale } = await params;
  const dict = await getDictionary(locale);

  if (role !== 'student' && role !== 'teacher') {
    return <div>{t(dict, 'errors.invalidRole')}</div>
  }
  
  return <AuthForm mode="signup" role={role} />;
}
