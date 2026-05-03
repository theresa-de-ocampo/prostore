import Image from "next/image";
import loader from "@/assets/loader.gif";

export default function Loading() {
  return (
    <main className="h-dvh flex-center">
      <Image
        src={loader}
        alt="Loading"
        height={128}
        width={128}
        className="size-32"
        unoptimized
      />
    </main>
  );
}
