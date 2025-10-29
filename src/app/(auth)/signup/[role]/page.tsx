import { AuthForm } from "@/components/auth/auth-form";
import { getDictionary, t } from "@/lib/dictionaries";
import type { Locale, UserRole } from "@/lib/types";

type SignupPageProps = {
  params: {
    role: UserRole;
    locale: Locale;
  };
};

export default async function SignupPage({ params }: SignupPageProps) {
  const { role, locale } = params;
  const dict = await getDictionary(locale);

  if (role !== 'student' && role !== 'teacher') {
    return <div>{t(dict, 'errors.invalidRole')}</div>
  }
  
  return <AuthForm mode="signup" role={role} />;
}
