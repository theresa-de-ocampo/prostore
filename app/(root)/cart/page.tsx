import type { Metadata } from "next";
import { getCartCookie, getCart } from "@/lib/actions/cart.actions";

// * Components
import PageState from "@/components/shared/page-state";
import ShoppingCart from "./cart";

export const metadata: Metadata = {
  title: "Cart"
};

export default async function CartPage() {
  const cartCookie = await getCartCookie();
  const cart = await getCart(cartCookie);

  return (
    <section className="h-full">
      <h2>Shopping Cart</h2>
      {cart && cart.items.length > 0 ? (
        <ShoppingCart cart={cart} />
      ) : (
        <PageState
          title="Empty Cart"
          link={{ label: "View Products", href: "/" }}
        />
      )}
    </section>
  );
}
