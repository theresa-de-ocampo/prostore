import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.actions";
import { formatId } from "@/lib/utils";

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
    <section className="max-w-5xl mx-auto">
      <h2>Order {formatId(id)}</h2>
      <OrderDetails order={order} />
    </section>
  );
}
