# 1. Upgrading Other Next.js Projects

## 1.1. Migrating to Server Actions

As reference, have a look at Next.js 13 `CreateProductModal.jsx` sample code (private repo).

1. Migrate hooks containing the API calls to Server Actions.
2. No need for the `loader.show()` / `hide()` in the action itself — use `useFormStatus` on the client side for pending states.
3. Keep using React Hook Form for responsive client-side validation. In the Server Action, extract the form data and re-validate. It makes to perform the validation both on client and server-side.
4. As for the error handling and post-submission events, this should stay on the client-side. You'll have to rely on the `data` returned by `useActionState`. This way, all of your actions will return the same structure of response. You'll also be sure that display of toast notifications and any other UI logic remain on the component — not in API hooks. This leads to clearer separation of concerns and a more predictable codebase.

## 1.2. How to Handle Multi-Step Forms?

### Statement of the Problem

1. Form data is spread out across pages.
2. The last page that should call the action is more likely a review panel that doesn't contain an actual `form` tag.

### Solution

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

## 1.3. When Not to Use Server Actions?

If your handlers are just external API calls, just group them into custom hooks. Server Actions are designed for server-centric workflows like database mutations.

If you have a separate back-end (Node.js), Server Actions isn't needed.

## 1.4 When to use `"use server"`?

`"use server"` is necessary for [server action](lib/actions). In Next.js App Router, components are Server Components by default, but server actions require the `"use server"` directive to mark the module (or individual functions) as server-only and to enable invocation from the client. Without it, these action exports won't be treated as server actions and won't be callable from client components or forms.

So: default rendering ≠ server actions. You can move `"use server"` to specific exported functions instead of the whole file, but you need it somewhere in scope for actions.
