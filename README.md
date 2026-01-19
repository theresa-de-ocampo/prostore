# Next.js 16 & React 19: Looking at What's New

A personal dev log as I revisit and upgrade my Next.js skills through [Brad Traversy's Tutorial](https://www.traversymedia.com/nextjs-ecommerce).

## 1. Upgrading Other Next.js Projects

### 1.1. Migrating to Server Actions

As reference, have a look at Next.js 13 `CreateProductModal.jsx` sample code (private repo).

1. Migrate hooks containing the API calls to Server Actions.
2. No need for the `loader.show()` / `hide()` in the action itself — use `useFormStatus` on the client side for pending states.
3. Keep using React Hook Form for responsive client-side validation. In the Server Action, extract the form data and re-validate. It makes to perform the validation both on client and server-side.
4. As for the error handling and post-submission events, this should stay on the client-side. You'll have to rely on the `data` returned by `useActionState`. This way, all of your actions will return the same structure of response. You'll also be sure that display of toast notifications and any other UI logic remain on the component — not in API hooks. This leads to clearer separation of concerns and a more predictable codebase.

### 1.2. How to Handle Multi-Step Forms?

#### Statement of the Problem

1. Form data is spread out across pages.
2. The last page that should call the action is more likely a review panel that doesn't contain an actual `form` tag.

#### Solution

This is exactly what `useTransition` is for. Checkout [sign-form-v2](<app/(auth)/sign-up/sign-up-form-v2.tsx>) for a complete example.

```javascript
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}
```

Also Read: [Point of useTransition for server actions?](https://github.com/vercel/next.js/discussions/51121)

### 1.3. When Not to Use Server Actions?

If your handlers are just external API calls, just group them into custom hooks. Server Actions are designed for server-centric workflows like database mutations.

If you have a separate back-end (Node.js), Server Actions isn't needed.

### 1.4 When to use `"use server"`?

`"use server"` is necessary for [server action](lib/actions). In Next.js App Router, components are Server Components by default, but server actions require the "use server" directive to mark the module (or individual functions) as server-only and to enable invocation from the client. Without it, these action exports won’t be treated as server actions and won’t be callable from client components or forms.

So: default rendering ≠ server actions. You can move "use server" to specific exported functions instead of the whole file, but you need it somewhere in scope for actions.

<!-- #endregion ONE -->

## 2. App Creation & Basic Layout

### 2.1. Create Next App & Assets

#### Fonts

In the past, using Google Fonts meant copying link tags into your HTML. If we do it like this, the fonts need to be loaded from a CDN every time the user makes a request to the page. Especially in a case when the user is in a slow internet, it can take some time to load the correct font. In this case, a fallback font will be used for the page until the correct font is loaded from the CDN. So, this increases the layout shift of your site.

A better way is to host the fonts yourself. And this is what Next.js is doing. CSS and font files are downloaded at build time and self-hosted with the rest of your static assets. No requests are sent to Google by the browser.

In summary, Next.js includes built-in automatic self-hosting for any font file.

After you've loaded the font, the variable must be available in the CSS scope - that is, in the DOM tree. So first, you'll have to add `fontFamily.variable` in the parent element (usually at `layout.tsx`). This is the variable that holds the reference to the font to be used in Tailwind or your own CSS.

To apply the font, use `fontFamily.variable` or simply `font-fontFamily` if you've already set up the font theme in Tailwind.

### 2.2. Theme Mode Toggle

Encountered the hydration error whenever I'm changing the theme even though I've already set `use client`. This is because **client components** are still **server rendered**, read more at [If using `use client` in all components. Why use Next.js at all?](https://www.reddit.com/r/nextjs/comments/1c80rfp/if_using_use_client_in_all_components_why_use/)

### 2.3. Responsive Sheet Menu

`@layer utilities` is now [deprecated](https://tailwindcss.com/docs/upgrade-guide#adding-custom-utilities). Custom classes would not work when applying responsive prefixes like `md:flex-start`.

## 3. Database, Prisma, & Product Display

1. Once you've created that database in Vercel, don't copy the environment variables just yet because Prisma can handle it for you.
2. `npx prisma init` creates a schema file (`prisma/schema.prisma`) where we create all of our models. This also adds `DATABASE_URL` into `.env` with dummy values.
3. Define your models.
4. Add `postinstall: prisma generate` to `package.json` to make sure that the Prisma client has been generated after deployment. To generate a Prisma client locally, use `npx prisma generate`.
5. Run `npx prisma migrate dev --name init`. It's a database migration tool that automatically generates SQL migration files from changes in your declarative Prisma schema. This is the command that will create the actual tables. Failure to execute this will throw errors in the Studio: `Prisma Client Error. Unable to run script. No default workspace found.` You should run this command whenever you make changes to `schema.prisma`.
6. `npx prisma studio`
7. `npx tsx ./db/seed`

### 3.1. API Routes vs Server Actions

Mobile Apps

### 3.2. Fetching from the Prisma Database

- What the Prisma client returns initially is a Prisma object that's why you have to convert it first.
- By default, layouts and pages are server components which lets you fetch data and render parts of your UI on the server. That's why `getLatestProducts` was not placed inside a `useEffect`.

### 3.3. [Serverless Environment Configuration](https://neon.com/docs/serverless/serverless-driver)

Traditional databases maintain persistent TCP connections to handle requests. However, serverless environments (like Vercel) are designed to scale automatically and don’t maintain persistent connections between invocations. If you try to connect directly to a database from a serverless function (actions or `pages/api`), you might run into issues like:

- **Connection limits**: Serverless environments can spawn many instances simultaneously, exceeding database connection limits.
- **Cold starts**: Connections are slow to initialize in serverless environments.
- **Incompatibility with WebSockets**: Neon uses WebSockets for serverless compatibility, while Prisma assumes a traditional TCP setup.

The Neon adapter solves these problems by adapting Prisma’s behavior to Neon’s serverless architecture. It allows Prisma to manage connections using WebSockets and pooling, so that it works in a serverless context.

#### Packages

- `npm i @neondatabase/serverless`
- `npm i @prisma/adapter-neon`
- `npm i ws`
- `npm i @types/ws --save-dev`
- `npm i bufferutil --save-dev`

#### What happens if you don't use `.$extends`?

It will throw `Type 'Decimal' is not assignable to type 'string'`. Note that even if you change the type of the price to a number in the Zod schema, it will then throw `Type 'Decimal' is not assignable to type 'number'`. Keep in mind that Prisma uses **Decimal.js**.

### 3.4. Product Details Page

Aside from using `props.params`, you can also use `useRouter`.

## 4. Authentication with NextAuth

### 4.1. [NextAuth Set-Up](https://authjs.dev/getting-started/adapters/prisma)

- `npm i next-auth`
- `npm i @auth/prisma-adapter`
- `npx auth secret`

If you're going to create a database adapter, make sure you familiarize yourself with the [models](https://authjs.dev/concepts/database-models) Auth.js expects to be present.

### 4.2. [When to use `satisfies` keyword?](https://refine.dev/blog/typescript-satisfies-operator/#typescript-satisfies---annotated-type-has-precedence-over-satisfies-type)

Use `satisfies` when you're working with complex objects containing many nested properties.

```typescript
type TAddress = {
  addressLine1: string;
  addressLine2?: string;
  postCode: number | string;
  city: string;
  state: string;
  country: string;
};

type UserKeys = "username" | "email" | "firstName" | "lastName" | "address";
type TUser = Record<UserKeys, string | TAddress>;

const joe: TUser = {
  username: "joe_hiyden",
  email: "joe@exmaple.com",
  firstName: "Joe",
  lastName: "Hiyden",
  address: {
    addressLine1: "1, New Avenue",
    addressLine2: "Mission Bay",
    postCode: 12345,
    city: "California",
    state: "California",
    country: "USA"
  }
} satisfies TUser;

console.log(joe.address.postCode); // Property 'postCode' does not exist on type 'string | TAddress'. Property 'postCode' does not exist on type 'string'.(2339)
```

### 4.3. Sign In

Initially you were importing `signIn` from `next-auth/react` at `user.action.ts`. This will produce either one of the following errors.

```
ReferenceError: window is not defined
    at _callee6$ (C:\Users\Therese\repositories\01-personal\learnings\prostore\.next\dev\server\chunks\ssr\node_modules_e3f1f1de._.js:1367:168)
```

```
Error: Attempted to call signIn() from the server but signIn is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.
```

This was fixed by migrating NextAuth to Beta version.

### 4.4. Sign Out

At `user-button.tsx`, if you try to directly use the `signOut` function from `NextAuth(config)`, it will throw an error.

```
[{
	"resource": "/c:/Users/Therese/repositories/01-personal/learnings/prostore/components/shared/header/user-button.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '<R extends boolean = true>(options?: { redirectTo?: string | undefined; redirect?: R | undefined; } | undefined) => Promise<R extends false ? any : never>' is not assignable to type 'string | ((formData: FormData) => void | Promise<void>) | undefined'.\n  Type '<R extends boolean = true>(options?: { redirectTo?: string | undefined; redirect?: R | undefined; } | undefined) => Promise<R extends false ? any : never>' is not assignable to type '(formData: FormData) => void | Promise<void>'.\n    Types of parameters 'options' and 'formData' are incompatible.\n      Type 'FormData' has no properties in common with type '{ redirectTo?: string | undefined; redirect?: true | undefined; }'.",
	"source": "ts",
	"startLineNumber": 48,
	"startColumn": 17,
	"endLineNumber": 48,
	"endColumn": 23,
	"relatedInformation": [
		{
			"startLineNumber": 3026,
			"startColumn": 9,
			"endLineNumber": 3026,
			"endColumn": 15,
			"message": "The expected type comes from property 'action' which is declared here on type 'DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>'",
			"resource": "/c:/Users/Therese/repositories/01-personal/learnings/prostore/node_modules/@types/react/index.d.ts"
		}
	],
	"origin": "extHost1"
}]
```

#### Why `logOut` works without errors although it's also just a function call to signOut

- `logOut` is defined as a server action in `user.action.ts`.
- It's marked with `"use server"` at the top of the file, making it a proper server action.
- Server actions are designed to be used directly in `form` `action` props. Their type signature aligns with what React expects: `(formData?: FormData) => void | Promise<void> | Promise<any>`.
- Even though `logOut` doesn't explicitly take `FormData`, Next.js handles it gracefully for simple actions like this.

#### Why `signOut` throws the Type Error

- It's not a server action — it's meant to be called directly in other server actions or routes.

### 4.5. JWT Callback

When you're using the Credentials provider, you control the user object returned during the `authorize` callback, but `profile` will be `undefined`.

When using any OAuth provider, the provider returns a `profile` object usually containing `name`, `email`, `image`, and `roles`. Different providers may name their fields differently or provide varying levels of information.

### 4.6. Updating Sessions

Consider the following callbacks.

```javascript
async jwt({ session }) {...},
async session({ session }) {...}
```

Those session parameters are not the same object, and they're used in different situations.

#### `jwt` callback — `session` param

The `session` argument here is only present when the trigger is _"update"_ — i.e., when you call:

```javascript
import { useSession } from "next-auth/react";
const { update } = useSession();
update();
```

- `session` contains the partial session fields being updated. In this case, its value would only be `{ name: Harry }`.
- It is not the full session.
- It is not the session sent to the client.
- You usually use to merge new/updated fields into the JWT.

Note that at this point — when you call `update()` — the `user` argument of the `jwt` callback will be undefined since it is only the response returned from the `authorize` callback.

#### `session` callback — `session` param

- `session` is the object returned to the browser.
- Values from the JWT are usually attached to it.

### 4.7. New Users

New users can be detected using the `jwt` callback. In v4, there's an `isNewUser` param, but this has now been replaced with the `signUp` trigger.

## 5. Add to Cart

### 5.1. `NextRouter was not mounted.`

`next/router` is for the older **Pages Router** and `next/navigation` is for the newer **App Router**.

### 5.2. Request Headers

Initially, the headers were explicitly forwarded, but is not needed since it wasn't modified.

```typescript
authorized({ request, auth }) {
  let response: NextResponse<unknown> | boolean = true;

  if (!request.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const requestHeaders = new Headers(request.headers);
    response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });

    response.cookies.set("sessionCartId", sessionCartId);
  }

  return response;
}
```

Nonetheless, in any case that the headers have to modified, DO NOT use the shorthand notation: `NextResponse.next({ headers })`.

#### Forwarding the headers upstream (to the server, not the browser)

```javascript
NextResponse.next({
  request: {
    headers
  }
});
```

- Modifies the request that continues to your route / server action.
- The browser does not see these headers.

#### Forwarding the headers downstream (to the client)

```javascript
NextResponse.next({
  headers
});
```

- Modifies the response sent to the browser.
- These headers go over the network.
- This may override framework-critical headers.
- This might unintentionally change `Content-Type`, and break streaming server actions.

## 6. Cart & Shipping Address Pages

### 6.1. Shipping Address Form

The tutorial made use of the `<Form>` wrapper approach.

```javascript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>// some code</form>
</Form>
```

However, this is now [deprecated](https://ui.shadcn.com/docs/components/form#:~:text=We%20are%20not%20actively%20developing%20this%20component%20anymore.) and is no longer the [recommended approach](https://ui.shadcn.com/docs/forms/react-hook-form#form).

Instead of using `<FormField>`, use the `<Field>` component instead. The `FormField` was specifically designed for integration with React Hook Form, whereas the newer `Field` abstraction is designed to be a more flexible, universal solution that supports multiple form libraries and technologies.

#### Shadcn `FormField`

- **Form Library Specific**: `FormField` was built with a direct dependency on the `useForm` hook from RHF.
- **Usage**: It relied on RHF's `Controller` or `useController` internally to manage form state, validation, and errors.
- **Limitation**: It was tightly coupled to RHF, making it difficult to use with other form management libraries.

#### Shadcn `Field`

- **Universal Abstraction**: `Field` is a newer abstraction intended to work seamlessly across different form solutions.
- **Compatibility**: It is designed to be compatible with:
  - Next.js Server Actions
  - React Hook Form
  - TanStack Form

### 6.2. [Next.js Proxy and NextAuth's `authorized` Callback](https://github.com/nextauthjs/next-auth/issues/12976)

Initially you've modified proxy.ts to hold the logic for protecting routes.

```javascript
// proxy.ts
import { NextResponse } from "next/server";

// export { auth as proxy } from "@/auth";
import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    const signInURL = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInURL);
  }
});

export const config = {
  matcher: "/checkout/:path"
};
```

However, this caused regression with setting the session cart ID. If you use the auth function as a wrapper in your middleware, then it will **NOT** call the authorized callback.

If you use the middleware without passing a callback, then it calls the `authorized` callback. That's why you reverted it back to the following.

```javascript
// proxy.ts
export { auth as proxy } from "@/auth";
```

### 6.3. Returning `false` from NextAuth's `authorized` callback

The `authorized` callback in NextAuth is designed to control access to routes. When it returns `false`, NextAuth automatically redirects the user to the `signIn` page specified in the `pages` configuration.

It also automatically includes a `callbackUrl` query parameter.

## 7. Payment Method & Order Pages

### 7.1. `useFormStatus` without `useActionState`

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

Note that `useFormStatus` can run both on client and server components. On the other hand, `useActionState` can only run on the client.

## 7.2. Why is `convertToPlainObject` unnecessary?

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

Convert what is convertible via $extends, use Zod for the rest.

## 8. PayPal Payments

### 8.1. Axios for Next.js?

Initially, you used `axios` instead of `fetch`.

```javascript
await client.post(
  "/v1/oauth2/token",
  new URLSearchParams({ grant_type: "client_credentials" }),
  {
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_CLIENT_SECRET
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
);
```

However, Next.js has optimizations directly intended for `fetch` such as:

- Deduplicate Requests
- Cache Responses
- Revalidate Automatically
- Understand Request Lifecycles

```javascript
await fetch(url, {
  next: { revalidate: 300 }
});
```

**References**:

- [Caching fetch requests](https://nextjs.org/docs/app/getting-started/caching-and-revalidating#fetch)
- [Caching does not work with axios](https://github.com/vercel/next.js/discussions/63221)

### 8.1 `new URLSearchParams()`

In the current code to get the access token, the body could also be set in any of the following:

```javascript
new URLSearchParams({ grant_type: "client_credentials" });
```

```javascript
const body = new URLSearchParams();
body.set("grant_type", "client_credentials");
```

## 19. What server means in Next.js

In Next.js, _server_ refers to the runtime environment where server code executes — things like:

- Server Components
- Route Handlers (`app/api/*`)
- Server Actions
- `getServerSideProps` in Pages Router

If you deploy to Azure App Service, the _Server_ = App Service.

If you deploy to Vercel or other serverless providers, then the _server_ becomes:

- Edge Functions
- Serverless Functions
- Regional Runtimes

Instead of a long-running server, SSR is executed per-request. In this case, _Server_ = serverless function execution environment.

But conceptually, it still fits the same role: the place where pre-rendering and data fetching happen before HTML is sent to the browser.

## 20. Server-Side Caching

### 20.1. Data Request Flow

```
Client (Browser)
   ⬇️
Server (Next.js Runtime)
   ⬇️
Caching Layers
   ⬇️
Data Source (DB / API)
```

### 20.2. Main Players

There are three main players, all of which operates in the server.

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Lives In</th>
      <th>Lifetime</th>
      <th>Speed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>In-Memory Cache</td>
      <td>RAM</td>
      <td>Per Instance</td>
      <td>⚡Fastest</td>
    </tr>
    <tr>
      <td>Persistent Cache</td>
      <td>
        Disk Storage (Vercel = Edge / Build Cache Storage; Self-Hosted =
        <code>.next/cache</code> on disk)
      </td>
      <td>Across Restarts</td>
      <td>🚀 Fast</td>
    </tr>
    <tr>
      <td>Data Source</td>
      <td>
        Database or APIs (Postgres, Prisma, Neon, PlanetScale, or third-party
        APIs like Shopify)
      </td>
      <td>Permanent</td>
      <td>🐢 Slowest and most expensive layer to hit</td>
    </tr>
  </tbody>
</table>

## 21. Next/Image

If you replaced an image but it keeps on showing the old image, delete the entire `.next` folder. This due to Next/Image's cache which stores the optimized files under `.next/cache/images`.
