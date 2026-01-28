import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("p-5 border-t flex-center", className)}>
      {currentYear} {APP_NAME}. All Rights Reserved.
      <Link
        className="relative ml-1 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
        href="/chat"
      >
        Contact Us
      </Link>
      .
    </footer>
  );
}
