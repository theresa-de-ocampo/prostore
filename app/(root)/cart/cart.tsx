"use client";

import { useTransition } from "react";

// * Types
import { Cart } from "@/types";

// * Components
import CartTable from "./cart-table";
import CartSummary from "./cart-summary";

export default function ShoppingCart({ cart }: { cart: Cart }) {
  const transition = useTransition();

  return (
    <div className="flex gap-10">
      <CartTable cart={cart} transition={transition} />
      <CartSummary cart={cart} transition={transition} />
    </div>
  );
}
