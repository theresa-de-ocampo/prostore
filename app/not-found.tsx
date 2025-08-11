import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-center flex-col h-dvh">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} Logo`}
        width={48}
        height={48}
        priority
      />
      <div className="text-center p-6 shadow-md w-max lg:w-1/3">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button asChild variant="outline" className="m-4">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
