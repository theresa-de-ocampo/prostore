import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert a Prisma object into a regular JavaScript object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// TODO. Handle round-offs.
export function formatDecimal(value: string, digits = 2): string {
  const [wholeNumber, fractionalPart = ""] = value.split(".");

  return `${wholeNumber}.${fractionalPart.padEnd(digits, "0")}`;
}
