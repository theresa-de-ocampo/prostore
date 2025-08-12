import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";

export const metadata = {
  title: "Home"
};

export default function Home() {
  return (
    <main>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={4}
      />
    </main>
  );
}
