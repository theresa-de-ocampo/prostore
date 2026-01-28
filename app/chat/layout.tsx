import Header from "@/components/shared/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "Customer Support"
};

export default function ChatLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen font-inter">
      <Header className="fixed top-0 w-full bg-background z-10" />
      <main className="wrapper">{children}</main>
      <Footer className="fixed bottom-0 w-full bg-background z-10" />
    </div>
  );
}
