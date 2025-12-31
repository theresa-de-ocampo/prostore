import { ShoppingCart } from "lucide-react";
import Link from "next/link";

// * Components
import ModeToggle from "./mode-toggle";
import { Button } from "@/components/ui/button";
import UserButton from "./user-button";

export default function MenuItems() {
  return (
    <>
      <ModeToggle />
      <Button asChild variant="ghost">
        <Link href="/cart">
          <ShoppingCart /> Cart
        </Link>
      </Button>
      <UserButton />
    </>
  );
}
