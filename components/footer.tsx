import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "p-5 border-t flex sm:flex-center flex-col sm:flex-row gap-0 sm:gap-1",
        className
      )}
    >
      <p>
        {currentYear} {APP_NAME}. All Rights Reserved.
      </p>
      <Link
        className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:content-[''] hover:after:w-full w-max"
        href="/chat"
      >
        Contact Us<span className="hidden sm:inline">.</span>
      </Link>
    </footer>
  );
}
