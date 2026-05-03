import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function PageState({
  title,
  link
}: {
  title: string;
  link: { label: string; href: string };
}) {
  return (
    <div className="flex-center flex-col min-h-full">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} Logo`}
        width={48}
        height={48}
        priority
      />
      <div className="text-center p-6 shadow-md w-max lg:w-1/3">
        <h3>{title}</h3>
        <Button asChild variant="outline" className="m-4">
          <Link href={link.href}>{link.label}</Link>
        </Button>
      </div>
    </div>
  );
}
