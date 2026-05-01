# 7. Payment Method & Order Pages

## 7.1. `useFormStatus` without `useActionState`

There was no:

```javascript
const [data, action] = useActionState(createOrder, {
  success: false,
  message: "",
  redirectTo: undefined
});
```

at [Placed Order Form](<app/(root)/checkout/place-order/place-order-form.tsx>) because you have to handle the redirects.

Unlike with the [Sign-Up Form](<app/(auth)/sign-up/sign-up-form.tsx>), `useActionState` was used since NextAuth already took care of the redirect on `success`.

## 7.2. Common Pitfall with `useFormStatus`

`useFormStatus` will only return status information for a parent `<form>`. That is, the hook must run in a descendant of the form, not in the same component that creates the form.

`useFormStatus` is tied to the nearest parent form submission submission state, either from `<form action={...}>` or `<form onSubmit={...}>`.

```jsx
export default function PlaceOrderForm() {
  const router = useRouter();
  const { pending } = useFormStatus(); // 🚩 `pending` will never be true

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await createOrder();

    if (response.redirectTo) {
      router.push(response.redirectTo);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Spinner />} Place Order
      </Button>
    </form>
  );
}
```

## 7.3. Why is `convertToPlainObject` unnecessary?

It's supposed to convert a Prisma object into a regular JavaScript object.

But the function signature is `convertToPlainObject<T>(value: T): T`, so TypeScript still thinks the return type is the original Prisma type (`Decimal`, `Date`, etc.).

Initially, you had this code without defining `$extends` for cart:

```typescript
export async function getCart({
  sessionCartId,
  userId
}: {
  sessionCartId: string;
  userId: string | null;
}) {
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId }
  });

  let validatedCart = undefined;

  const test = convertToPlainObject(cart);
  const testPrice = test?.itemsPrice;

  if (cart) {
    validatedCart = cartRecord.parse(convertToPlainObject(cart));
  }

  return validatedCart;
}
```

When you hover over `testPrice`, its type is `Decimal`. When you remove `convertToPlainObject`, there's no TypeScript errors from the editor.

```typescript
export async function getCart({
  sessionCartId,
  userId
}: {
  sessionCartId: string;
  userId: string | null;
}) {
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId }
  });

  let validatedCart = undefined;

  if (cart) {
    validatedCart = cartRecord.parse(cart);
  }

  return validatedCart;
```

So far, we've been getting around this **static type** issue by parsing with the Zod schema. We have this `money` utility that automatically converts `Decimal` into strings.

### Use a combination of schema validation and `$extends`

Prisma's `$extends` can't fully fix the static type issue because there's still `JsonValue`, `JsonValue[]`, and `PAYMENT_METHOD`. Even if we were able to somehow convert all `JsonValue` to a normal JS object, we loose the structure information — does it have a shape of `CartItem` or `ShippingAddress`? That's why Zod's `parse` is still needed.

If we then only rely on schema validation without extending the Prisma client, then we would have to also `parse` even for intermediate steps that may not have JSON or enum types. Here's an example:

```typescript
export async function addToCart(data: CartItem) {
  // snipped for brevity
  const cartCookie = await getCartCookie();
  const cart = await getCart(cartCookie);

  const item = cartItemSchema.parse(data);

  const product = await prisma.product.findFirst({
    where: { id: item.productId }
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  let message: string;
  if (cart) {
    // Without $extends, will have to first parse product as well
    // or use .toString() inline
    message = await addItemToExistingCart(cart, data, product);
  }
}
```

### Conclusion

Convert what is convertible via `$extends`, use Zod for the rest.
