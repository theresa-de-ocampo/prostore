"use server";

import { prisma } from "@/db/prisma";

export async function loadContext(scopes: string[]) {
  const types = Array.from(new Set(["generic", ...scopes]));

  const docs = await prisma.knowledgeDoc.findMany({
    where: { type: { in: types } },
    select: { type: true, body: true }
  });

  return {
    generic: docs.filter((doc) => doc.type === "generic")[0].body,
    matched: docs.filter((doc) => doc.type !== "generic")
  };
}
