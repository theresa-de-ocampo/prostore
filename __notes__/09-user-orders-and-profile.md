# 9. Order History & User Profile

## Updating Sessions

Initially, [UserButton](../components/shared/header/user-button.tsx) was a server component.

```javascript
const session = await auth();
```

However, this meant that updating the user name required `router.refresh()` so server components like `UserButton` re-render with the new name.

The `UserButton` is now client-driven so it updates instantly without needing a route refresh.

```javascript
const { data: session } = useSession();
```
