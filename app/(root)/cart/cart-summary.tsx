"use client";

import { useRouter } from "next/navigation";

// * Components
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// * Types
import { Cart } from "@/types";

export default function CartSummary({ cart }: { cart: Cart }) {
  const router = useRouter();

  return (
    <Card className="min-w-max">
      <CardContent>
        <p className="flex-between">
          <span>
            Subtotal (
            {cart.items.reduce(
              (totalItems, item) => totalItems + item.quantity,
              0
            )}
            )
          </span>
          <span className="font-bold">{cart.itemsPrice}</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push("/shipping-address")}>
          <ArrowRight /> Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
