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
