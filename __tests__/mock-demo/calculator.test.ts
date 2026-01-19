import { calculateTotal } from "./calculator";
import { add } from "./math";

jest.mock("./math");

test("calculateTotal uses mocked add", () => {
  (add as jest.Mock).mockReturnValue(100);

  const result = calculateTotal(10, 2);

  expect(add).toHaveBeenCalledWith(10, 2);
  expect(result).toBe(100);
});
