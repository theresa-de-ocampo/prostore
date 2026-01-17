import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.actions";

export const metadata = {
  title: "Order Details"
};

export default async function OrderDetailsPage(props: {
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
    </section>
  );
}
