import { z } from "zod";
import { formatDecimal } from "./utils";
import { KNOWLEDGE_DOC_TYPE, PAYMENT_METHOD } from "./constants";

const nullableString = z
  .string()
  .trim()
  .nullable()
  .default(null)
  .transform((s) => (s === "" ? null : s));

const money = z.coerce
  .string()
  .transform((value) => formatDecimal(value))
  .refine((value) => /^\d+(\.\d{2})?$/.test(value));

const dbRecordSchema = z.object({
  id: z.uuid(),
  createdAt: z.date()
});

export const productSchema = z.object({
  name: z.string().trim().min(3, "Product name must be at least 3 characters."),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters."),
  category: z.string().trim().min(3),
  description: z.string().trim().min(3),
  images: z
    .array(z.string().trim().min(4))
    .min(1, "Product must have at least one image."),
  price: money,
  brand: z.string().trim().min(3),
  rating: z
    .string()
    .refine((value) => /^\d\.\d$/.test(formatDecimal(value, 1))),
  stock: z.coerce.number().int(),
  isFeatured: z.boolean().default(false),
  banner: nullableString
});

export const productRecord = dbRecordSchema.extend(productSchema.shape);

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

export const signUpSchema = z
  .object({
    name: nullableString,
    email: z.email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"]
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required."),
  name: z.string().min(1, "Product name is required."),
  slug: z.string().min(1, "Slug is required."),
  quantity: z.int().nonnegative("Quantity must be a positive number."),
  image: z.string().min(1, "Image is required."),
  price: money
});

export const cartCookieSchema = z.object({
  sessionCartId: z.string().min(1, "Session Cart ID is required."),
  userId: z.string().nullable()
});

export const cartSchema = cartCookieSchema.extend({
  items: z.array(cartItemSchema),
  itemsPrice: money,
  totalPrice: money,
  shippingPrice: money,
  taxPrice: money,
  sessionCartId: z.string().min(1, "Session Cart ID is required."),
  userId: z.string().nullable()
});

export const cartRecord = dbRecordSchema.extend(cartSchema.shape);

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().nonempty("Name is required."),
  street: z.string().trim().nonempty("Street is required."),
  city: z.string().trim().nonempty("City is required."),
  postalCode: z.string().trim().nonempty("Postal Code is required."),
  country: z.string().trim().nonempty("Country is required."),
  latitude: z.number().min(-90).max(-90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});

export const paymentMethodSchema = z.object({
  type: z.nativeEnum(PAYMENT_METHOD)
});

export const orderSchema = z.object({
  userId: z.uuid(),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(PAYMENT_METHOD),
  itemsPrice: money,
  shippingPrice: money,
  taxPrice: money,
  totalPrice: money
});

export const orderItemSchema = cartItemSchema.extend({
  orderId: z.uuid()
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string().nullish(),
  email: z.string().nullish(),
  pricePaid: money.nullish()
});

export const knowledgeDocSchema = z.object({
  type: z.enum(KNOWLEDGE_DOC_TYPE),
  body: z.string().trim().min(1, "Knowledge doc body is required.")
});

export const knowledgeDocRecord = dbRecordSchema.extend(
  knowledgeDocSchema.shape
);

export const orderRecord = dbRecordSchema
  .extend(orderSchema.shape)
  .extend({
    paymentResult: paymentResultSchema.nullish(),
    isPaid: z.boolean().default(false),
    paidAt: z.date().nullable(),
    isDelivered: z.boolean().default(false),
    deliveredAt: z.date().nullable(),
    orderItems: z.array(orderItemSchema),
    user: z.object({
      name: z.string(),
      email: z.email()
    })
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentMethod === PAYMENT_METHOD.PAYPAL &&
      data.isPaid === true &&
      !data.paymentResult
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["paymentResult"],
        message: "Payment result is required when a PayPal order is paid."
      });
    }

    if (
      data.paymentMethod === PAYMENT_METHOD.PAYPAL &&
      data.isPaid === true &&
      data.paymentResult?.status !== "COMPLETED"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["paymentResult", "status"],
        message:
          "PayPal payment status must be COMPLETED when an order is paid."
      });
    }
  });
