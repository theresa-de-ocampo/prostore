import type { Metadata } from "next";

// * Lib
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { getExecutiveSummary } from "@/lib/actions/admin.action";

// * Components
import Charts from "./charts";
import Link from "next/link";
import {
  BadgeDollarSignIcon,
  CreditCardIcon,
  ScanBarcodeIcon,
  UsersIcon,
  ExternalLinkIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Admin Dashboard"
};

export default async function OverviewPage() {
  const summary = await getExecutiveSummary();

  return (
    <section className="flex flex-col gap-4">
      <h2>Dashboard</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex-between mb-2">
              <CardTitle>Total Revenue</CardTitle>
              <BadgeDollarSignIcon />
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalSales)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex-between mb-2">
              <CardTitle>Sales</CardTitle>
              <CreditCardIcon />
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex-between mb-2">
              <CardTitle>Customers</CardTitle>
              <UsersIcon />
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(summary.customersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex-between mb-2">
              <CardTitle>Products</CardTitle>
              <ScanBarcodeIcon />
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts salesData={summary.salesData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL ($)</TableHead>
                  <TableHead>DETAILS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).shortDateOnly}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(order.totalPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/order/${order.id}`}
                        target="_blank"
                        className="flex-center"
                      >
                        <ExternalLinkIcon className="size-5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
