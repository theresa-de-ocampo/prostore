import { add } from "./math";

export function calculateTotal(price: number, tax: number) {
  return add(price, tax);
}
