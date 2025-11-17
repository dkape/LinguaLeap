'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { useLocale } from '@/contexts/locale-context';
import { t } from '@/lib/dictionaries';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { dict } = useLocale();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t(dict, 'auth.verification.noToken'));
      return;
    }

    const verify = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiUrl}/auth/verify-email?token=${token}`);
        const data = await response.json();
      
        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || t(dict, 'auth.verification.failed'));
        }
      } catch {
        setStatus('error');
        setMessage(t(dict, 'auth.verification.networkError'));
      }
    };

    verify();
  }, [token, dict]);

  const handleResendVerification = async () => {
    const email = prompt(t(dict, 'auth.verification.enterEmail'));
    if (!email) return;

    setIsResending(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(t(dict, 'auth.verification.resendSuccess'));
      } else {
        alert(data.message || t(dict, 'auth.verification.resendFailed'));
      }
    } catch {
      alert(t(dict, 'auth.verification.networkError'));
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-12 w-12 text-green-600" />}
            {status === 'error' && <XCircle className="h-12 w-12 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && t(dict, 'auth.verification.verifying')}
            {status === 'success' && t(dict, 'auth.verification.success')}
            {status === 'error' && t(dict, 'auth.verification.failed')}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <Button onClick={handleGoToLogin} className="w-full">
              {t(dict, 'auth.verification.goToLogin')}
            </Button>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={handleResendVerification} 
                disabled={isResending}
                className="w-full"
                variant="outline"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t(dict, 'auth.verification.sending')}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    {t(dict, 'auth.verification.resendVerification')}
                  </>
                )}
              </Button>
              <Button onClick={handleGoToLogin} variant="ghost" className="w-full">
                {t(dict, 'auth.verification.backToLogin')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  const { dict } = useLocale();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold">{t(dict, 'auth.verification.loading')}</CardTitle>
            <CardDescription>{t(dict, 'auth.verification.waitMessage')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}