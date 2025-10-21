import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";

const ptSans = PT_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans'
});

export const metadata: Metadata = {
  title: "LinguaLeap",
  description: "An app that helps children learn to read.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={ptSans.variable}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
