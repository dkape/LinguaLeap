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
import { useRouter, usePathname } from "next/navigation";
import type { UserRole } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
  role: UserRole;
};

export function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { signUp, logIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const lang = pathname.split('/')[1] || 'en';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.extend({
      name: mode === 'signup' ? z.string().min(2, "Name must be at least 2 characters.") : z.string().optional(),
    })),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        if (!values.name) {
          toast({ variant: 'destructive', title: 'Error', description: 'Name is required for signup.' });
          setIsLoading(false);
          return;
        }
        await signUp(values.email, values.password, values.name, role);
        toast({ title: 'Success', description: 'Account created successfully!' });
      } else {
        await logIn(values.email, values.password);
      }
      router.push(`/${lang}/${role}/dashboard`);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const title = mode === 'login' ? 'Welcome Back!' : 'Create an Account';
  const description = `Enter your credentials to ${mode} as a ${role}.`;
  const buttonText = mode === 'login' ? 'Login' : 'Sign Up';
  const linkText = mode === 'login' ? "Don't have an account?" : "Already have an account?";
  const linkHref = `/${lang}/${mode === 'login' ? 'signup' : 'login'}/${role}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
            <div className="text-sm text-muted-foreground">
              {linkText}{" "}
              <Link href={linkHref} className="text-primary hover:underline">
                {mode === 'login' ? 'Sign up' : 'Login'}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
