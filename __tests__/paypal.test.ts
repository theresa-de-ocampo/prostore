import { generateAccessToken, payPal } from "../lib/paypal";

test("generates token from paypal", async () => {
  const response = await generateAccessToken();
  expect(typeof response).toBe("string");
  expect(response.length).toBeGreaterThan(0);
});

test("creates a paypal order", async () => {
  const response = await payPal.createOrder(10);
  console.dir(response, { depth: null });
  expect(response.id).toBeDefined();
  expect(response.status).toBe("CREATED");
});

test("simulate capturing a payment from an order", async () => {
  const orderId = "123";

  const mockCapturePayment = jest
    .spyOn(payPal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED"
    });

  const response = await payPal.capturePayment(orderId);
  expect(response.status).toBe("COMPLETED");

  mockCapturePayment.mockRestore();
});
