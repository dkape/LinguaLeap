'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/locale-context";
import { t } from "@/lib/dictionaries";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { dict } = useLocale();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);
      toast({ title: t(dict, 'auth.forgotPassword.successTitle'), description: t(dict, 'auth.forgotPassword.successDescription') });
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = t(dict, 'auth.forgotPassword.genericError');
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: t(dict, 'auth.forgotPassword.errorTitle'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t(dict, 'auth.forgotPassword.title')}</CardTitle>
        <CardDescription>{t(dict, 'auth.forgotPassword.description')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(dict, 'auth.forgotPassword.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(dict, 'auth.forgotPassword.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t(dict, 'auth.forgotPassword.button')}
            </Button>
            <div className="text-sm text-muted-foreground">
              {t(dict, 'auth.forgotPassword.rememberPassword')}{" "}
              <Link href="/login/student" className="text-primary hover:underline">
                {t(dict, 'auth.forgotPassword.loginLink')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}