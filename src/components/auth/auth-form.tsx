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
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/types";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
  role: UserRole;
};

export function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd handle login/signup here.
    console.log(values);
    // For this demo, we'll just redirect to the appropriate dashboard.
    router.push(`/${role}/dashboard`);
  }

  const title = mode === 'login' ? 'Welcome Back!' : 'Create an Account';
  const description = `Enter your credentials to ${mode} as a ${role}.`;
  const buttonText = mode === 'login' ? 'Login' : 'Sign Up';
  const linkText = mode === 'login' ? "Don't have an account?" : "Already have an account?";
  const linkHref = `/${mode === 'login' ? 'signup' : 'login'}/${role}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
            <Button type="submit" className="w-full">
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
