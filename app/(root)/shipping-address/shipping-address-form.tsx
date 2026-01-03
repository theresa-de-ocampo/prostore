"use client";

import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// * Components

export default function ShippingAddressForm({
  address
}: {
  address?: ShippingAddress;
}) {
  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address
  });

  return (
    <section className="max-w-md mx-auto">
      <h2>Shipping Address</h2>
    </section>
  );
}
