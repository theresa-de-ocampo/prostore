import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home"
};

export default async function Home() {
  const latestProducts = await getLatestProducts();

  return (
    <section>
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </section>
  );
}
