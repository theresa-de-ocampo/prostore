import { cookies, headers } from "next/headers";

const TIMEZONE_COOKIE = "tz";

export async function getTimeZone() {
  const cookieTimeZone = (await cookies()).get(TIMEZONE_COOKIE)?.value;

  if (cookieTimeZone) {
    return decodeURIComponent(cookieTimeZone);
  }

  const headerTimeZone =
    (await headers()).get("sec-ch-time-zone") ??
    (await headers()).get("x-vercel-ip-timezone") ??
    (await headers()).get("x-geo-timezone");

  return headerTimeZone ?? undefined;
}
