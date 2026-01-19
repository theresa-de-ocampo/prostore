# 5. Add to Cart

## 5.1. `NextRouter was not mounted.`

`next/router` is for the older **Pages Router** and `next/navigation` is for the newer **App Router**.

## 5.2. Request Headers

Initially, the headers were explicitly forwarded, but is not needed since it wasn't modified.

```typescript
authorized({ request, auth }) {
  let response: NextResponse<unknown> | boolean = true;

  if (!request.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const requestHeaders = new Headers(request.headers);
    response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });

    response.cookies.set("sessionCartId", sessionCartId);
  }

  return response;
}
```

Nonetheless, in any case that the headers have to modified, DO NOT use the shorthand notation: `NextResponse.next({ headers })`.

### Forwarding the headers upstream (to the server, not the browser)

```javascript
NextResponse.next({
  request: {
    headers
  }
});
```

- Modifies the request that continues to your route / server action.
- The browser does not see these headers.

### Forwarding the headers downstream (to the client)

```javascript
NextResponse.next({
  headers
});
```

- Modifies the response sent to the browser.
- These headers go over the network.
- This may override framework-critical headers.
- This might unintentionally change `Content-Type`, and break streaming server actions.
