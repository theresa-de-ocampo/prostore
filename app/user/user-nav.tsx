"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function UserNav() {
  const pathname = usePathname();

  const links = [
    {
      title: "Profile",
      href: "/user/profile"
    },
    {
      title: "Orders",
      href: "/user/orders"
    }
  ];

  return (
    <nav className="flex items-center gap-6 text-sm">
      {links.map((item) => {
        const isActive = item.href === pathname;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "border-b-2 border-transparent pb-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive && "border-foreground text-foreground"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
