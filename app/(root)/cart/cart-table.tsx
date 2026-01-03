"use client";

import Image from "next/image";
import { Cart } from "@/types";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

export default function CartTable({ cart }: { cart?: Cart }) {
  return (
    <section>
      {cart && cart.items.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>
                  <Link href={`/product/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="inline"
                    />
                  </Link>
                  <span className="ml-2">{item.name}</span>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>
          Cart is empty. <Link href="/">View Products.</Link>
        </p>
      )}
    </section>
  );
}
