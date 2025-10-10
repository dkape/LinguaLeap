
import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";

type LoginPageProps = {
  params: { role: UserRole };
};

export default function LoginPage({ params: { role } }: LoginPageProps) {
  if (role !== 'student' && role !== 'teacher') {
    return <div>Invalid role specified.</div>
  }

  return <AuthForm mode="login" role={role} />;
}
