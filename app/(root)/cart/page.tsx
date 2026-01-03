import { getCartCookie, getCart } from "@/lib/actions/cart.actions";

// * Components
import Link from "next/link";
import ShoppingCart from "./cart";

export const metadata = {
  title: "Cart"
};

export default async function CartPage() {
  const cartCookie = await getCartCookie();
  const cart = await getCart(cartCookie);

  return (
    <section>
      <h2>Shopping Cart</h2>
      {cart && cart.items.length > 0 ? (
        <ShoppingCart cart={cart} />
      ) : (
        <p>
          Cart is empty. <Link href="/">View Products.</Link>
        </p>
      )}
    </section>
  );
}
