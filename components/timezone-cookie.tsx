"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
import { TIMEZONE_COOKIE } from "@/lib/constants";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export default function TimeZoneCookie() {
  const router = useRouter();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const existing = getCookie(TIMEZONE_COOKIE);

    if (existing !== timeZone) {
      document.cookie = `${TIMEZONE_COOKIE}=${encodeURIComponent(
        timeZone
      )}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`;

      router.refresh();
    }
  }, [router]);

  return null;
}
