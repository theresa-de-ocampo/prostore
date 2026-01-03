"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

// * Components
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import QuantityControls from "./quantity-controls";

// * Types
import { CartRecord, CartItem } from "@/types";

// * Actions
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";

export default function CartItemControls({
  cart,
  item
}: {
  cart?: CartRecord;
  item: CartItem;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart() {
    startTransition(async () => {
      const response = await addToCart(item);

      if (response.success) {
        toast.success(response.message, {
          action: { label: "Go to Cart", onClick: () => router.push("cart") }
        });
      } else {
        toast.error(response.message);
      }
    });
  }

  async function handleRemoveFromCart() {
    startTransition(async () => {
      const response = await removeFromCart(item);

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    });
  }

  const itemExists =
    cart &&
    cart.items.find((cartItem) => cartItem.productId === item.productId);

  return itemExists ? (
    <QuantityControls
      quantity={itemExists.quantity}
      onAdd={handleAddToCart}
      onRemove={handleRemoveFromCart}
      isPending={isPending}
    />
  ) : (
    <Button
      className="w-full mt-2"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <Plus className="md:hidden lg:inline" />}
      Add to Cart
    </Button>
  );
}
