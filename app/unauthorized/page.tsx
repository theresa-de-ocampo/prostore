import type { Metadata } from "next";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized"
};

export default function Unauthorized() {
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
        <h3>Unauthorized Access</h3>
        <Button asChild variant="outline" className="m-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
