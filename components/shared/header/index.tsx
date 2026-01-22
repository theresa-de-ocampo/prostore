import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

// * Components
import Menu from "./menu";

export default function Header({
  centerContent
}: {
  centerContent?: React.ReactNode;
}) {
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
      {centerContent}
      <Menu />
    </header>
  );
}
