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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  let message;

  if (error.name === "ZodError") {
    const fieldErrors = error.issues.map(
      (issue: { message: string }) => issue.message
    );
    message = fieldErrors.join(" ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    console.dir(error?.meta?.driverAdapterError, { depth: null });
    const field = error.meta.driverAdapterError.cause.constraint.fields[0];

    if (typeof field === "string") {
      message = `${field.charAt(0).toUpperCase()}${field.slice(
        1
      )} already exists.`;
    }
  } else {
    message =
      typeof error.message === "string"
        ? error.message
        : JSON.stringify(error.message);
  }

  return message;
}
