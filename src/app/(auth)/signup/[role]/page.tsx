
import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";

type SignupPageProps = {
  params: { role: UserRole };
};

export default function SignupPage({ params }: SignupPageProps) {
  const role = params.role;
  if (role !== 'student' && role !== 'teacher') {
    return <div>Invalid role specified.</div>
  }
  
  return <AuthForm mode="signup" role={role} />;
}
