import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexClerkProvider";
import { UserSync } from "@/components/providers/UserSync";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tars — Live Chat",
  description: "Real-time messaging app built with Next.js, Convex, and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <UserSync />
          </TooltipProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
