import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export class RedirectableError extends Error {
  redirectTo: string;

  constructor(message: string, redirectTo: string) {
    super(message);
    this.redirectTo = redirectTo;
  }
}

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

export function round(value: number | string): number {
  let number = value;

  if (typeof number === "string") {
    number = parseFloat(number);
  }

  return Math.round((number + Number.EPSILON) * 100) / 100;
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

export function formatId(id: string) {
  return id.substring(id.length - 6);
}

export function formatDateTime(
  dateInput: Date | string,
  timeZone?: string,
  locale = "en-US"
) {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric"
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };

  const date = new Date(dateInput);

  function withTimeZone(options: Intl.DateTimeFormatOptions) {
    return timeZone ? { ...options, timeZone } : options;
  }

  function formatWithFallback(options: Intl.DateTimeFormatOptions) {
    let formatted: string;

    try {
      formatted = new Intl.DateTimeFormat(locale, withTimeZone(options)).format(
        date
      );
    } catch {
      formatted = new Intl.DateTimeFormat(locale, options).format(date);
    }

    return formatted;
  }

  const formattedDateTime = formatWithFallback(dateTimeOptions);
  const formattedDate = formatWithFallback(dateOptions);
  const formattedTime = formatWithFallback(timeOptions);

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime
  };
}

export function getCookie(name: string) {
  let value = null;

  if (typeof document !== "undefined") {
    const match = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`));

    if (match) {
      value = decodeURIComponent(match.split("=").slice(1).join("="));
    }
  }

  return value;
}
