import CartTable from "./cart-table";
import { getCartCookie, getCart } from "@/lib/actions/cart.actions";
import Link from "next/link";
import CartSummary from "./cart-summary";

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
        <div className="flex gap-10">
          <CartTable cart={cart} />
          <CartSummary cart={cart} />
        </div>
      ) : (
        <p>
          Cart is empty. <Link href="/">View Products.</Link>
        </p>
      )}
    </section>
  );
}
