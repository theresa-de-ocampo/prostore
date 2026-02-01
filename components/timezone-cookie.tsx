"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TIMEZONE_COOKIE = "tz";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export default function TimeZoneCookie() {
  const router = useRouter();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timeZone) {
      return;
    }

    const existing = readCookie(TIMEZONE_COOKIE);

    if (existing === timeZone) {
      return;
    }

    document.cookie = `${TIMEZONE_COOKIE}=${encodeURIComponent(
      timeZone
    )}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`;
    router.refresh();
  }, [router]);

  return null;
}
