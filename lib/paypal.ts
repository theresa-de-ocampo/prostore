const BASE_URL = process.env.PAYPAL_API_URL;

if (!BASE_URL) {
  throw new Error("PayPal API URL must be defined.");
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`${response.status} ${errorMessage}`);
  }

  return response.json();
}

async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

  if (!PAYPAL_CLIENT_ID) {
    throw new Error("PayPal Client ID is required.");
  }

  if (!PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal Client Secret is required");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  const data = await handleResponse(response);

  return data.access_token;
}

async function createOrder(price: string) {
  const accessToken = await generateAccessToken();

  const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price
          }
        }
      ]
    })
  });

  return handleResponse(response);
}

async function capturePayment(orderId: string) {
  const accessToken = await generateAccessToken();

  const response = await fetch(
    `${BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return handleResponse(response);
}

export { generateAccessToken };

export const payPal = {
  createOrder,
  capturePayment
};
