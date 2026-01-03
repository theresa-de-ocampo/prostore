import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductImages from "@/components/shared/product/product-images";
import CartItemControls from "@/components/shared/cart/cart-item-controls";
import { getCartCookie, getCart } from "@/lib/actions/cart.actions";

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const cartCookie = await getCartCookie();
  const cart = await getCart(cartCookie);

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
      <section className="min-w-max">
        <Card>
          <CardContent className="flex flex-col gap-2">
            <div className="flex-between">
              <p className="md:text-sm lg:text-base">Price</p>
              <ProductPrice
                value={parseFloat(product.price)}
                className="md:text-xl lg:text-2xl"
              />
            </div>
            <div className="flex-between">
              <p className="md:text-sm lg:text-base">Status</p>
              {product.stock > 0 ? (
                <Badge variant="outline" className="md:px-1 lg:px-2">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="md:px-1 lg:px-2">
                  Sold Out
                </Badge>
              )}
            </div>
            {product.stock > 0 && (
              <CartItemControls
                cart={cart}
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  quantity: 1,
                  image: product.images[0],
                  price: product.price
                }}
              />
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
