import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthHashErrorHandler } from "@/components/AuthHashErrorHandler";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "UXAuditX — AI-Powered CRO Audit",
  description: "Get an instant 12-point AI audit of your website's conversion rate. Discover what's stopping visitors from becoming customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthHashErrorHandler />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
      <GoogleAnalytics gaId="G-S95YG8H187" />
    </html>
  );
}
