import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import MenuItems from "./menu-items";
import { EllipsisVertical } from "lucide-react";

export default function Menu() {
  return (
    <>
      <nav className="hidden md:flex-start space-x-2">
        <MenuItems />
      </nav>
      <nav className="block md:hidden">
        <Sheet>
          <SheetTrigger>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-6">
            <SheetTitle>Menu</SheetTitle>
            <MenuItems />

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
