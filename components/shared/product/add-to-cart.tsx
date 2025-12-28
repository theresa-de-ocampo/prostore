"use client";

import { useRouter } from "next/navigation";

// * Components
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// * Types
import { CartItem } from "@/types";

// * Actions
import { addToCart } from "@/lib/actions/cart.actions";

export default function AddToCartButton({ item }: { item: CartItem }) {
  const router = useRouter();

  async function handleAddToCart() {
    const response = await addToCart(item);

    if (response?.success) {
      toast.success(response.message, {
        action: { label: "Go to Cart", onClick: () => router.push("cart") }
      });
    } else {
      toast.error(response.message);
    }
  }

  return (
    <Button className="w-full mt-2" type="button" onClick={handleAddToCart}>
      <Plus />
      Add to Cart
    </Button>
  );
}
