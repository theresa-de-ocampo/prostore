import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyOrderList() {
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
        <h3>Empty Order List</h3>
        <Button asChild variant="outline" className="m-4">
          <Link href="/">View Products</Link>
        </Button>
      </div>
    </div>
  );
}
