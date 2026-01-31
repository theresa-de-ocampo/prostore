import { fuzzy } from "fast-fuzzy";

it("value", () => {
  const result = fuzzy("best-seller", "What's your best seller?");
  console.log(result);
});
