import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

// * Components
import TimeZoneCookie from "@/components/timezone-cookie";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
