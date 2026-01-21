// * Components
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PriceSummary from "./price-summary";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";

// * Utils
import { formatDateTime } from "@/lib/utils";

// * Types
import { OrderRecord } from "@/types";

export default function OrderDetails({ order }: { order: OrderRecord }) {
  const {
    isDelivered,
    isPaid,
    orderItems,
    paymentMethod,
    shippingAddress,
    user,
    paidAt,
    deliveredAt
  } = order;

  return (
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
                {shippingAddress.street}, {shippingAddress.city}
              </p>
              <p>
                {shippingAddress.postalCode} {shippingAddress.country}
              </p>
            </div>
            {isDelivered && deliveredAt ? (
              <Badge variant="secondary" className="self-end">
                Delivered at {formatDateTime(deliveredAt).dateTime}
              </Badge>
            ) : (
              <Badge variant="destructive" className="self-end">
                Not Delivered
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader>
            <CardTitle>PaymentMethod</CardTitle>
          </CardHeader>
          <CardContent className="flex-between">
            <div>
              <p>{paymentMethod}</p>
            </div>
            {isPaid && paidAt ? (
              <Badge variant="secondary">
                Paid at {formatDateTime(paidAt).dateTime}
              </Badge>
            ) : (
              <Badge variant="destructive">Not Paid</Badge>
            )}
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
                {orderItems.map((item) => (
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
                    <TableCell className="text-center">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <PriceSummary order={order} />
      </div>
    </div>
  );
}
