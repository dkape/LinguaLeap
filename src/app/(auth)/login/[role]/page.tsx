import { AuthForm } from "@/components/auth/auth-form";
import { getDictionary, t } from "@/lib/dictionaries";
import type { Locale, UserRole } from "@/lib/types";

type LoginPageProps = {
  params: {
    role: UserRole;
    locale: Locale;
  };
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { role, locale } = params;
  const dict = await getDictionary(locale);

  if (role !== 'student' && role !== 'teacher') {
    // Or handle this more gracefully, e.g., notFound() from next/navigation
    return <div>{t(dict, 'errors.invalidRole')}</div>
  }

  return <AuthForm mode="login" role={role} />;
}
