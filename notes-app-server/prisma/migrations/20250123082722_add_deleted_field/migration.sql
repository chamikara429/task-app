-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "deleted" SMALLINT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);
