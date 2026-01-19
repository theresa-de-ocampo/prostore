# 6. Cart & Shipping Address Pages

## 6.1. Shipping Address Form

The tutorial made use of the `<Form>` wrapper approach.

```javascript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>// some code</form>
</Form>
```

However, this is now [deprecated](https://ui.shadcn.com/docs/components/form#:~:text=We%20are%20not%20actively%20developing%20this%20component%20anymore.) and is no longer the [recommended approach](https://ui.shadcn.com/docs/forms/react-hook-form#form).

Instead of using `<FormField>`, use the `<Field>` component instead. The `FormField` was specifically designed for integration with React Hook Form, whereas the newer `Field` abstraction is designed to be a more flexible, universal solution that supports multiple form libraries and technologies.

### Shadcn `FormField`

- **Form Library Specific**: `FormField` was built with a direct dependency on the `useForm` hook from RHF.
- **Usage**: It relied on RHF's `Controller` or `useController` internally to manage form state, validation, and errors.
- **Limitation**: It was tightly coupled to RHF, making it difficult to use with other form management libraries.

### Shadcn `Field`

- **Universal Abstraction**: `Field` is a newer abstraction intended to work seamlessly across different form solutions.
- **Compatibility**: It is designed to be compatible with:
  - Next.js Server Actions
  - React Hook Form
  - TanStack Form

## 6.2. [Next.js Proxy and NextAuth's `authorized` Callback](https://github.com/nextauthjs/next-auth/issues/12976)

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

## 6.3. Returning `false` from NextAuth's `authorized` callback

The `authorized` callback in NextAuth is designed to control access to routes. When it returns `false`, NextAuth automatically redirects the user to the `signIn` page specified in the `pages` configuration.

It also automatically includes a `callbackUrl` query parameter.
