"use client";

import { useRouter } from "next/navigation";

// * Components
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

// * Types
import { Cart } from "@/types";
import { TransitionStartFunction } from "react";

export default function CartSummary({
  cart,
  transition
}: {
  cart: Cart;
  transition: [boolean, TransitionStartFunction];
}) {
  const [isPending, startTransition] = transition;
  const router = useRouter();

  return (
    <div>
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
            <span className="font-bold">${cart.itemsPrice}</span>
          </p>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(() => router.push("/checkout/shipping-address"))
            }
          >
            {isPending ? <Spinner /> : <ArrowRight />} Proceed to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
