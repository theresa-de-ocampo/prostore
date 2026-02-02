"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { addQueryParams } from "@/lib/utils";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParams = searchParams.get("page");
  const page = pageParams ? parseInt(pageParams, 10) : 1;

  function handleClick(type: string) {
    const pageValue = type === "next" ? page + 1 : page - 1;
    const destination = addQueryParams({
      params: searchParams.toString(),
      key: "page",
      value: pageValue.toString()
    });

    router.push(destination);
  }

  return (
    <footer className="flex gap-2">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => handleClick("previous")}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => handleClick("next")}
      >
        Next
      </Button>
    </footer>
  );
}
