# 8. PayPal Payments

## 8.1. Axios for Next.js?

Initially, you used `axios` instead of `fetch`.

```javascript
await client.post(
  "/v1/oauth2/token",
  new URLSearchParams({ grant_type: "client_credentials" }),
  {
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_CLIENT_SECRET
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
);
```

However, Next.js has optimizations directly intended for `fetch` such as:

- Deduplicate Requests
- Cache Responses
- Revalidate Automatically
- Understand Request Lifecycles

```javascript
await fetch(url, {
  next: { revalidate: 300 }
});
```

**References**:

- [Caching fetch requests](https://nextjs.org/docs/app/getting-started/caching-and-revalidating#fetch)
- [Caching does not work with axios](https://github.com/vercel/next.js/discussions/63221)

## 8.2 `new URLSearchParams()`

In the current code to get the access token, the body could also be set in any of the following:

```javascript
new URLSearchParams({ grant_type: "client_credentials" });
```

```javascript
const body = new URLSearchParams();
body.set("grant_type", "client_credentials");
```

## 8.3. Set-Up Jest

1. Install the following: `npm i -D jest ts-jest ts-node @types/jest @types/node dotenv`.
2. Run `npm init jest@latest`
3. At `jest.config.ts`, set `preset` to `ts-jest`.
4. Enable `.env` by creating `jest.setup.ts` and importing `.env`.
5. At `jest.config.ts`, configure `setupFiles: ["<rootDir>/jest.setup.ts"]`.
6. Write unit tests. Note that Next.js' alias `@/` can't be used.

### `dotenv`

When using Next.js, the `dotenv` package is not needed. Next.js automatically imports the environment variables from `.env` or `.env.local` files.

Install `dotenv` only if you have **standalone Node scripts** that rune _outside_ Next.js.

- Prisma Seed Scripts
- Custom CLI
- Jest - test files will not be run within Next.js, so there's no access to `process.env`. In this case, the `dotenv` package is needed to recognize the `.env` files.

## 8.4. Request Body of `fetch`

Take a look at the request body for creating an order, it's wrapped in `JSON.stringify`. Note that `fetch` only accepts **strings** (not objects) as the HTTP body.

## 8.5. Jest's `mock` vs `spyOn`

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th><code>jest.mock()</code></th>
      <th><code>jest.spyOn()</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Scope</td>
      <td>Entire module</td>
      <td>Single function/method</td>
    </tr>
    <tr>
      <td>Default behavior</td>
      <td>Replaces implementation</td>
      <td>Keeps real implementation</td>
    </tr>
    <tr>
      <td>Can observe calls</td>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>Can override behavior</td>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>Best for</td>
      <td>Isolation</td>
      <td>Observation / partial override</td>
    </tr>
  </tbody>
</table>

### `jest.spyOn()`

`jest.spyOn(object, method)` creates a spy on an existing function. By default:

- The real implementation still runs, unless you override it.
- Jest records:
  - How many times it was called
  - With what arguments
  - What is returned

### `jest.mock()`

`jest.mock()` replaces a real module with a fake (mocked) version during tests. Instead of calling the _real implementation_ (API calls, database access, payment providers, etc.), the test uses a controlled substitute.

- Replaces the function entirely.
- The original code never runs.

#### Auto-Mock

```javascript
jest.mock("./api");
```

See a complete [example](__tests__/mock-demo) where Jest automatically turns function definitions at `math.ts` into:

```typescript
add: jest.fn();
multiply: jest.fn();
```

#### Manual Mock

**Factory Function**

```javascript
jest.mock("./api", () => ({
  fetchUser: jest.fn(() => Promise.resolve({ name: "Alex" }))
}));
```

**Factory Modules**

```
├── models
│   ├── __mocks__
│   │   └── user.js
│   └── user.js
```

Then just say:

```javascript
jest.mock("./models/user");
```

Read more from [Jest Docs](https://jestjs.io/docs/manual-mocks).
