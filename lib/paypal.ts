const BASE_URL = process.env.PAYPAL_API_URL;

if (!BASE_URL) {
  throw new Error("PayPal API URL must be defined.");
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

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `PayPal token request failed: ${response.status} ${errorMessage}`
    );
  }

  const data = await response.json();

  return data.access_token;
}
