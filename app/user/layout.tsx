import Header from "@/components/shared/header";
import UserNav from "./user-nav";
import Footer from "@/components/footer";

export default function UserLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col font-inter">
      <Header centerContent={<UserNav />} />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
