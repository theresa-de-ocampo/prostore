import Link from "next/link";
import { formatId, formatDateTime } from "@/lib/utils";
import { getTimeZone } from "@/lib/server/timezone";

// * Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";

// * Actions
import { getMyOrders } from "@/lib/actions/order.actions";

export const metadata = {
  title: "My Orders"
};

export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await props.searchParams;
  const timeZone = await getTimeZone();

  const orders = await getMyOrders({
    page: parseInt(page, 10) || 1
  });

  return (
    <section className="flex flex-col gap-4">
      <h2>Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>TOTAL</TableHead>
            <TableHead>PAID</TableHead>
            <TableHead className="text-center">DELIVERED</TableHead>
            <TableHead className="text-center">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatId(order.id)}</TableCell>
              <TableCell>
                {formatDateTime(order.createdAt, timeZone).dateTime}
              </TableCell>
              <TableCell>${order.totalPrice}</TableCell>
              <TableCell>
                {order.paidAt
                  ? formatDateTime(order.paidAt, timeZone).dateTime
                  : "Not Paid"}
              </TableCell>
              <TableCell className="text-center">
                {order.isDelivered ? "Delivered" : "Not Delivered"}
              </TableCell>
              <TableCell className="text-center">
                <Link href={`/order/${order.id}`}>Details</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={orders.totalPages} />
    </section>
  );
}
