# 19. What server means in Next.js

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

