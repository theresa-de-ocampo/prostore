"use client";

import { useRouter } from "next/navigation";

// * Components
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

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

  async function handleAddToCart() {
    const response = await addToCart(item);

    if (response.success) {
      toast.success(response.message, {
        action: { label: "Go to Cart", onClick: () => router.push("cart") }
      });
    } else {
      toast.error(response.message);
    }
  }

  async function handleRemoveFromCart() {
    const response = await removeFromCart(item);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  const itemExists =
    cart &&
    cart.items.find((cartItem) => cartItem.productId === item.productId);

  return itemExists ? (
    <div className="flex-center mt-2">
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <Minus />
      </Button>
      <span className="px-3">{itemExists.quantity}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        <Plus />
      </Button>
    </div>
  ) : (
    <Button className="w-full mt-2" type="button" onClick={handleAddToCart}>
      <Plus className="md:hidden lg:inline" />
      Add to Cart
    </Button>
  );
}
