import Link from "next/link";
import type { Metadata } from "next";

// * Components
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import PageState from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// * Actions
import { getOrders, deleteOrder } from "@/lib/actions/admin/order.actions";

// * Lib
import { formatId, formatDateTime } from "@/lib/utils";
import { getTimeZone } from "@/lib/server/timezone";

export const metadata: Metadata = {
  title: "Orders"
};

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) {
  const { page = "1" } = await searchParams;
  const timeZone = await getTimeZone();

  const orders = await getOrders({
    page: parseInt(page, 10)
  });

  if (orders.data.length === 0) {
    return (
      <PageState
        title="No Orders"
        link={{ label: "View Products", href: "/admin/products" }}
      />
    );
  }

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
              <TableCell className="flex-center gap-1">
                <Button asChild variant="outline">
                  <Link href={`/order/${order.id}`}>
                    <ExternalLinkIcon />
                  </Link>
                </Button>
                <DeleteDialog id={order.id} action={deleteOrder} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={orders.totalPages} />
    </section>
  );
}
