import CartTable from "./cart-table";
import { getCartCookie, getCart } from "@/lib/actions/cart.actions";

export const metadata = {
  title: "Cart"
};

export default async function CartPage() {
  const cartCookie = await getCartCookie();
  const cart = await getCart(cartCookie);

  return (
    <section>
      <h2>Shopping Cart</h2>
      <CartTable cart={cart} />
    </section>
  );
}
