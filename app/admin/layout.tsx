import Header from "@/components/shared/header";
import AdminNav from "./admin-nav";
import Footer from "@/components/footer";

export default function UserLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col font-inter">
      <Header centerContent={<AdminNav />} />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
