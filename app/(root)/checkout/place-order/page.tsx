import { redirect } from "next/navigation";

// * Components
import Link from "next/link";
import Image from "next/image";
import PlaceOrderForm from "./place-order-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { EditIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";

// * Actions
import { getCart, getCartCookie } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";

// * Types
import { ShippingAddress } from "@/types";

export const metadata = {
  title: "Place Order"
};

export default async function PlaceOrderPage() {
  const cartCookie = await getCartCookie();
  const cart = await getCart(cartCookie);

  if (!cartCookie.userId) {
    throw new Error("No user ID.");
  }

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const user = await getUserById(cartCookie.userId);

  if (!user.address) {
    redirect("/shipping-address");
  }

  if (!user.paymentMethod) {
    redirect("/payment-method");
  }

  const address = user.address as ShippingAddress;

  return (
    <section className="max-w-5xl mx-auto">
      <h2 className="text-center">Place Order</h2>
      <div className="grid md:grid-cols-3 gap-4 my-5">
        <div className="md:col-span-2 space-y-4">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="flex-between">
              <div>
                <p>{user.name}</p>
                <p>
                  {address.street}, {address.city}
                </p>
                <p>
                  {address.postalCode} {address.country}
                </p>
              </div>
              <Button variant="outline" className="self-end" asChild>
                <div>
                  <EditIcon />
                  <Link href="/checkout/shipping-address">Edit</Link>
                </div>
              </Button>
            </CardContent>
          </Card>
          <Card className="gap-3">
            <CardHeader>
              <CardTitle>PaymentMethod</CardTitle>
            </CardHeader>
            <CardContent className="flex-between">
              <div>
                <p>{user.paymentMethod}</p>
              </div>
              <Button variant="outline" className="self-end" asChild>
                <Link href="/checkout/payment-method">
                  <EditIcon />
                  Edit
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Items</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`}>
                          <Image
                            src={item.image}
                            alt="Product Image"
                            width={50}
                            height={50}
                            className="inline mr-1"
                          />
                          {item.name}
                        </Link>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-center">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent>
              <div className="flex-between">
                <div>Items</div>
                <div>${cart.itemsPrice}</div>
              </div>
              <div className="flex-between">
                <div>Tax</div>
                <div>${cart.taxPrice}</div>
              </div>
              <div className="flex-between">
                <div>Shipping</div>
                <div>
                  {cart.shippingPrice === "0.00" ? "Free" : cart.shippingPrice}
                </div>
              </div>
              <div className="flex-between font-bold">
                <div>Total Price</div>
                <div>${cart.totalPrice}</div>
              </div>
            </CardContent>
            <CardFooter>
              <PlaceOrderForm />
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
