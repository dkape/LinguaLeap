
import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";

export default function SignupPage({ params }: { params: { role: string }}) {
  const role = params.role as UserRole;

  if (role !== 'student' && role !== 'teacher') {
    return <div>Invalid role specified.</div>
  }
  
  return <AuthForm mode="signup" role={role} />;
}
