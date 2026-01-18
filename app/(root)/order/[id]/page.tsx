import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.actions";

// * Components
import OrderDetails from "./order-details";

export const metadata = {
  title: "Order Details"
};

export default async function OrderPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <section>
      <h2>Order Details</h2>
      <OrderDetails order={order} />
    </section>
  );
}
