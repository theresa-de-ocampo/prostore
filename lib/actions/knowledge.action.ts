"use server";

import type { ContextBundle, ContextScope } from "@/types";

import { prisma } from "@/db/prisma";

export async function loadContext(scopes: string[]): Promise<ContextBundle> {
  const types = Array.from(new Set(["generic", ...scopes]));

  const docs = await prisma.knowledgeDoc.findMany({
    where: { type: { in: types } },
    select: { type: true, body: true }
  });

  const { base, matched } = docs.reduce(
    (contextBundle, doc) => {
      if (doc.type === "generic") {
        contextBundle.base = doc.body;
      } else {
        contextBundle.matched.push({ scope: doc.type, content: doc.body });
      }

      return contextBundle;
    },
    { base: "", matched: [] as ContextScope[] }
  );

  return {
    base,
    matched
  };
}
