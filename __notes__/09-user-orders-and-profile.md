# 9. Order History & User Profile

## Updating Sessions

Initially, [UserButton](../components/shared/header/user-button.tsx) was changed to be client-driven so it updates instantly without needing a route refresh.

```javascript
const { data: session } = useSession();
```

However, this caused regression with the sign-in flow there the header is stale right after credentails submit or redirect. This flow then required a page refresh.

According to [Vercel's React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices), for auth-dependent UI in App Router, server rendering should be preferred to avoid client session drift and extra JS.

`useSession()` in client components can be temporarily stale when auth changes happen visa server actions (no client broadcast event).

Whereas server components read cookies/request auth state on navigation, so header identity is authoritative.
