import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

// * Components
import TimeZoneCookie from "@/components/timezone-cookie";
import { Toaster } from "@/components/ui/sonner";

// * Auth
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

// * Lib
import { APP_NAME, SERVER_URL } from "@/lib/constants";

// * Styles
import "@/assets/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: "ProStore"
  },
  description: "A modern eCommerce website built with Next.js",
  metadataBase: new URL(SERVER_URL)
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TimeZoneCookie />
          <SessionProvider session={session}>{children}</SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
