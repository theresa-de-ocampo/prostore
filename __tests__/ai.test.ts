import { selectContextScopes } from "../lib/ai";

describe("ChatBot", () => {
  describe("selectContextScopes", () => {
    it("should include order_tracking", () => {
      const userInput = "I haven't received my order yet.";
      const scopes = selectContextScopes(userInput);
      expect(scopes.includes("order_tracking")).toBe(true);
    });
  });
});
