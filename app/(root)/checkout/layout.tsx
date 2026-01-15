"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CHECKOUT_PAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function CheckoutLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function getCurrentStep() {
    let step;

    switch (pathname) {
      case "/checkout/shipping-address":
        step = 0;
        break;
      case "/checkout/payment-method":
        step = 1;
        break;
      case "/checkout/place-order":
        step = 2;
        break;
      default:
        step = 0;
        break;
    }

    return step;
  }

  const currentStep = getCurrentStep();

  return (
    <>
      <header className="mt-6 mb-9 md:mb-11">
        <ol className="flex flex-col gap-3 md:flex-row md:items-center justify-center md:gap-0">
          {CHECKOUT_PAGES.map((step, index) => {
            const isActive = index === currentStep;

            return (
              <React.Fragment key={index}>
                <li
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-gray-500 bg-secondary text-foreground"
                      : "border-border text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border text-xs",
                      isActive
                        ? "border-gray-500 bg-background text-foreground"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="whitespace-nowrap">{step}</span>
                </li>
                {step !== "Place Order" && (
                  <hr className="hidden md:block w-12 border-border" />
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </header>

      {children}
    </>
  );
}
