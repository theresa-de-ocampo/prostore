import { fuzzy } from "fast-fuzzy";
import { CONTEXT_SCOPE_MAP } from "./constants";

export function matchesTerm(userInput: string, term: string) {
  const FUZZY_THRESHOLD = 0.82;
  return fuzzy(term, userInput) >= FUZZY_THRESHOLD;
}

export function selectContextScopes(userInput: string) {
  const hits = new Set<string>();

  for (const context of CONTEXT_SCOPE_MAP) {
    for (const term of context.terms) {
      if (matchesTerm(userInput, term)) {
        hits.add(context.type);
        break;
      }
    }
  }

  return [...hits];
}
