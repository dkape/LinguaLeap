import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";

type LoginPageProps = {
  params: { role: UserRole };
};

export default function LoginPage({ params }: LoginPageProps) {
  if (params.role !== 'student' && params.role !== 'teacher') {
    // Or handle this more gracefully, e.g., notFound() from next/navigation
    return <div>Invalid role specified.</div>
  }

  return <AuthForm mode="login" role={params.role} />;
}
