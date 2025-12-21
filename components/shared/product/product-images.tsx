"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <section className="col-span-2">
      <Image
        src={images[current]}
        alt="Product Image"
        width={700}
        height={700}
        className="object-contain object-center max-h-[500px]"
      />
      <div className="flex gap-2 mt-2">
        {images.map((image, i) => (
          <button
            key={image}
            onClick={() => setCurrent(i)}
            className={cn(
              "mr-2 border hover:border-orange-600",
              current === i && "border-orange-500"
            )}
          >
            <Image src={image} alt="Product Image" width={100} height={100} />
          </button>
        ))}
      </div>
    </section>
  );
}
