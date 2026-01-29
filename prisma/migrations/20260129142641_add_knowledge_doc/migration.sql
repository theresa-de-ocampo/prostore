-- CreateTable
CREATE TABLE "KnowledgeDoc" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeDoc_pkey" PRIMARY KEY ("id")
);
