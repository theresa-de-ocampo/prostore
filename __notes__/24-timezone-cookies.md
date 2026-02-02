# Rendering Dates & Time

Initially, this was the code for rendering timestamps.

```typescript
export function formatDateTime(dateString: Date) {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric"
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime
  };
}
```

The function was called on server components which made use of the server's timezone (UTC), instead of getting the user's timezone.

`Intl.DateTimeFormat().resolvedOptions().timeZone` only works in the browser — not during SSR.

## Timezone Cookies

### `Path=/`

`Path=/` sets the cookie's scope to the entire site. Without it, the browser defaults the cookie path to the current page's path. For example, if the cookie were set while the user is on `/orders/`, the cookie, would only be sent to `/orders` and its subpaths like `/orders/123`.

### `SameSite=Lax`

`SameSite=Lax` tells the browser to withhold the cookie on most cross-site requests while still sending it on top-level navigations like clicking a link. It's a safer default that `SameSite=None` and helps reduce CSRF risk without breaking normal navigation.

### Example

The page at `https://prostore-iota-neon.vercel.app/` sets `tz=America/New_York; SameSite=Lax`.

What Lax does

1. User is on another site (e.g., `https://news.example`) that embeds a product listing:

   ```html
   <embed
     src="https://prostore-iota-neon.vercel.app/product/polo-classic-pink-hoodie"
     style="width:500px; height: 300px;"
   />
   ```

   Because this is a cross-site subresource request, the browser will NOT send the `tz` cookie. That is, `/product/polo-classic-pink-hoodie` sees no `tz`.

2. User clicks a normal link on that other site:

   ```html
   <a
     href="https://prostore-iota-neon.vercel.app/product/polo-classic-pink-hoodie"
   >
     Buy from ProStore
   </a>
   ```

   This is a top-level navigation, so the browser DOES send the `tz` cookie. While the cookie already belongs to that origin, the cookie is **included in the header request**.
