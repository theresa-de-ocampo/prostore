import NavigationMenu from "@/components/shared/header/navigation-menu";
import { Input } from "@/components/ui/input";

export default function AdminNav() {
  const links = [
    {
      title: "Overview",
      href: "/admin/overview"
    },
    {
      title: "Products",
      href: "/admin/products"
    },
    {
      title: "Orders",
      href: "/admin/orders"
    },
    {
      title: "Users",
      href: "/admin/users"
    }
  ];

  return (
    <div className="flex-center xl:flex-between flex-1 mx-3 sm:mx-12">
      <NavigationMenu links={links} className="hidden xl:flex" />
      <Input placeholder="Search" className="max-w-80" />
    </div>
  );
}
