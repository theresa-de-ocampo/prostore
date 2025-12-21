import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductImages from "@/components/shared/product/product-images";

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <ProductImages images={product.images} />
      <section className="col-span-2 flex flex-col gap-5">
        <p>
          {product.brand} {product.category}
        </p>
        <h2>{product.name}</h2>
        <p>
          {product.rating} of {product.numReviews} Reviews
        </p>
        <ProductPrice
          value={parseFloat(product.price)}
          className="w-max rounded-full bg-green-100 text-green-700 px-5 py-2"
        />
        <div>
          <p className="font-bold">Description:</p>
          <p>{product.description}</p>
        </div>
      </section>
      <section>
        <Card>
          <CardContent className="flex flex-col gap-2">
            <div className="flex-between">
              <p>Price</p>
              <ProductPrice value={parseFloat(product.price)} />
            </div>
            <div className="flex-between">
              <p>Status</p>
              {product.stock > 0 ? (
                <Badge variant="outline">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            {product.stock > 0 && (
              <Button className="w-full mt-2">Add to Cart</Button>
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
