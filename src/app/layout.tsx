import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "LinguaLeap - Learn Languages the Fun Way",
    template: "%s | LinguaLeap",
  },
  description: "An interactive language learning app for children. Learn to read, speak, and master new languages with AI-powered exercises.",
  keywords: ["language learning", "education", "children", "reading", "multilingual"],
  authors: [{ name: "LinguaLeap Team" }],
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LinguaLeap",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1419" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Theme initialization script - prevents flash of wrong theme */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (theme !== 'light' && prefersDark);
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Ensure color-scheme is set
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
