import { ShoppingCart, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

// * Components
import ModeToggle from "./mode-toggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex-between border-b wrapper">
      <Link href="/" className="flex-start">
        <Image
          src="/images/logo.svg"
          alt={`${APP_NAME} Logo`}
          height={48}
          width={48}
          priority={true}
        />
        <h1 className="hidden lg:block text-2xl font-bold ml-3">{APP_NAME}</h1>
      </Link>

      <div className="flex-start space-x-2">
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
      </div>
    </header>
  );
}
