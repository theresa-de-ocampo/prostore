import { getCartCookie, getCart } from "@/lib/actions/cart.actions";

// * Components
import ShoppingCart from "./cart";
import EmptyCart from "./empty-cart";

export const metadata = {
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
        <EmptyCart />
      )}
    </section>
  );
}
