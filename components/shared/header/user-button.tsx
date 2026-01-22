import Link from "next/link";

// * Components
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

// * Auth
import { auth } from "@/auth";

// * Actions
import { logOut } from "@/lib/actions/user.actions";

export default async function UserButton() {
  const session = await auth();

  if (!session?.user?.name || !session?.user?.email) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full bg-gray-200 w-9 h-9">
          {session.user.name.charAt(0).toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p>{session.user.name}</p>
          <p className="font-normal text-muted-foreground">
            {session.user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href="/user/profile" className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/user/orders" className="w-full">
            Order History
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="py-0 px-2">
          <form action={logOut}>
            <Button variant="ghost" className="w-full h-8 justify-start p-0">
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
