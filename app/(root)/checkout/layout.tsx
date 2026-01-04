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

  console.log(pathname);

  function getCurrentStep() {
    let step;

    switch (pathname) {
      case "/checkout/shipping-address":
        step = 1;
        break;
      case "/checkout/payment-method":
        step = 2;
        break;
      case "/checkout/place-order":
        step = 3;
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
      <header className="flex flex-col flex-between md:flex-row mt-5 mb-8 md:mb-11">
        {CHECKOUT_PAGES.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "p-2 w-56 text-center rounded-full",
                index === currentStep ? "bg-secondary" : ""
              )}
            >
              {step}
            </div>
            {step !== "Place Order" && <hr className="w-16 border-2" />}
          </React.Fragment>
        ))}
      </header>

      {children}
    </>
  );
}
