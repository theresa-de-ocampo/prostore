import { ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";

// * Components
import ModeToggle from "./mode-toggle";
import { Button } from "@/components/ui/button";

export default function MenuItems() {
  return (
    <>
      <ModeToggle />
      <Button asChild variant="ghost">
        <Link href="/cart">
          <ShoppingCart /> Cart
        </Link>
      </Button>
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    </>
  );
}
