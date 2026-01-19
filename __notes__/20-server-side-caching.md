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

