import "dotenv/config";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/db/prisma";
import sampleData from "./sample-data";

async function main() {
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });
  await seedKnowledgeDoc();

  console.log("Database seeded successfully.");
}

async function seedKnowledgeDoc() {
  await prisma.knowledgeDoc.deleteMany();
  const docsDir = path.resolve(process.cwd(), "db/docs");
  const docFiles = (await readdir(docsDir)).filter((file) =>
    file.toLowerCase().endsWith(".md")
  );

  const docs = await Promise.all(
    docFiles.map(async (file) => {
      const body = await readFile(path.join(docsDir, file), "utf8");
      const type = path.parse(file).name.replace("-", "_");

      return { type, body };
    })
  );

  if (docs.length > 0) {
    await prisma.knowledgeDoc.createMany({ data: docs });
  }
}

main();
