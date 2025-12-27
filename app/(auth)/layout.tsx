import { SessionProvider } from "next-auth/react";

export default function AuthLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <main className="w-full h-screen flex-center text-center">
        {children}
      </main>
    </SessionProvider>
  );
}
