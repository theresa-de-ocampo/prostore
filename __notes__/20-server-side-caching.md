# 20. Server-Side Caching

## 20.1. Data Request Flow

```
Client (Browser)
   ⬇️
Server (Next.js Runtime)
   ⬇️
Caching Layers
   ⬇️
Data Source (DB / API)
```

## 20.2. Main Players

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

## 20.3. [`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath#:~:text=Invalidates%20the%20specific%20page)

`revalidatePath` invalidates the cache for that specific page only, and updates the UI immediately if viewing the affected path.

### Wrong Mental Model

Initially, you thought that it worked like TanStack Query wherein it would refresh all pages. So you had something like:

```javascript
// admin/order.actions.ts
revalidatePath(`/order/${orderId}`);
revalidatePath("/admin/orders");
```

where `/admin/orders` had a link that opens `/order/${orderId}` on a new tab. On order edit at `/order/${orderId}`, you expected that the previously opened `/admin/orders` would also be refreshed.
