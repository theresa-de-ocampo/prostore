import { cookies, headers } from "next/headers";
import { TIMEZONE_COOKIE } from "../constants";

export async function getTimeZone() {
  const cookieTimeZone = (await cookies()).get(TIMEZONE_COOKIE)?.value;
  const headerTimeZone = (await headers()).get("x-vercel-ip-timezone");
  const timeZone = cookieTimeZone
    ? decodeURIComponent(cookieTimeZone)
    : (headerTimeZone ?? undefined);

  return timeZone;
}
