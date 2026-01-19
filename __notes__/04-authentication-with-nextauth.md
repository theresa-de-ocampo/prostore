# 4. Authentication with NextAuth

## 4.1. [NextAuth Set-Up](https://authjs.dev/getting-started/adapters/prisma)

- `npm i next-auth`
- `npm i @auth/prisma-adapter`
- `npx auth secret`

If you're going to create a database adapter, make sure you familiarize yourself with the [models](https://authjs.dev/concepts/database-models) Auth.js expects to be present.

## 4.2. [When to use `satisfies` keyword?](https://refine.dev/blog/typescript-satisfies-operator/#typescript-satisfies---annotated-type-has-precedence-over-satisfies-type)

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

## 4.3. Sign In

Initially you were importing `signIn` from `next-auth/react` at `user.action.ts`. This will produce either one of the following errors.

```
ReferenceError: window is not defined
    at _callee6$ (C:\Users\Therese\repositories\01-personal\learnings\prostore\.next\dev\server\chunks\ssr\node_modules_e3f1f1de._.js:1367:168)
```

```
Error: Attempted to call signIn() from the server but signIn is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.
```

This was fixed by migrating NextAuth to Beta version.

## 4.4. Sign Out

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

### Why `logOut` works without errors although it's also just a function call to signOut

- `logOut` is defined as a server action in `user.action.ts`.
- It's marked with `"use server"` at the top of the file, making it a proper server action.
- Server actions are designed to be used directly in `form` `action` props. Their type signature aligns with what React expects: `(formData?: FormData) => void | Promise<void> | Promise<any>`.
- Even though `logOut` doesn't explicitly take `FormData`, Next.js handles it gracefully for simple actions like this.

### Why `signOut` throws the Type Error

- It's not a server action — it's meant to be called directly in other server actions or routes.

## 4.5. JWT Callback

When you're using the Credentials provider, you control the user object returned during the `authorize` callback, but `profile` will be `undefined`.

When using any OAuth provider, the provider returns a `profile` object usually containing `name`, `email`, `image`, and `roles`. Different providers may name their fields differently or provide varying levels of information.

## 4.6. Updating Sessions

Consider the following callbacks.

```javascript
async jwt({ session }) {...},
async session({ session }) {...}
```

Those session parameters are not the same object, and they're used in different situations.

### `jwt` callback — `session` param

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

### `session` callback — `session` param

- `session` is the object returned to the browser.
- Values from the JWT are usually attached to it.

## 4.7. New Users

New users can be detected using the `jwt` callback. In v4, there's an `isNewUser` param, but this has now been replaced with the `signUp` trigger.
