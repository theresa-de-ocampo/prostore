"use client";

import Image from "next/image";
import { Cart, CartItem } from "@/types";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import QuantityControls from "@/components/shared/product/quantity-controls";

export default function CartTable({ cart }: { cart?: Cart }) {
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart(item: CartItem) {
    startTransition(async () => {
      const response = await addToCart(item);

      if (!response.success) {
        toast.error(response.message);
      }
    });
  }

  async function handleRemoveFromCart(item: CartItem) {
    startTransition(async () => {
      const response = await removeFromCart(item);

      if (!response.success) {
        toast.error(response.message);
      }
    });
  }

  return (
    <section>
      {cart && cart.items.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>
                  <Link href={`/product/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="inline"
                    />
                  </Link>
                  <span className="ml-2">{item.name}</span>
                </TableCell>
                <TableCell>
                  <QuantityControls
                    quantity={item.quantity}
                    onAdd={() => handleAddToCart(item)}
                    onRemove={() => handleRemoveFromCart(item)}
                    isPending={isPending}
                  />
                </TableCell>
                <TableCell>${item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>
          Cart is empty. <Link href="/">View Products.</Link>
        </p>
      )}
    </section>
  );
}
