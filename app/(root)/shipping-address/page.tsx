import { redirect } from "next/navigation";

// * Types
import { ShippingAddress } from "@/types";

// * Actions
import { getCartCookie, getCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";

// * Components
import ShippingAddressForm from "./shipping-address-form";

export const metadata = {
  title: "Shipping Address"
};

export default async function ShippingAddressPage() {
  const cartCookie = await getCartCookie();
  const cart = await getCart(cartCookie);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  if (!cartCookie?.userId) {
    throw new Error("No user ID");
  }

  const user = await getUserById(cartCookie.userId);

  return (
    <ShippingAddressForm
      userId={user.id}
      address={(user?.address || undefined) as ShippingAddress | undefined}
    />
  );
}
