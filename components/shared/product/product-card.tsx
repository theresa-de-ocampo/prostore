import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import ProductPrice from "./product-price";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Link href={product.slug}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
          />
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-xs">{product.brand}</p>
        <Link href={product.slug}>
          <h3 className="text-sm font-medium">{product.name}</h3>
        </Link>
      </CardContent>
      <CardFooter className="flex-between">
        <p>{product.rating} Stars</p>
        {product.stock ? (
          <ProductPrice value={product.price} />
        ) : (
          <p className="text-destructive">Out of Stock</p>
        )}
      </CardFooter>
    </Card>
  );
}
