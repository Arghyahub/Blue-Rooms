/*
  Warnings:

  - You are about to drop the column `personl` on the `Groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Groups" DROP COLUMN "personl",
ADD COLUMN     "personal" BOOLEAN NOT NULL DEFAULT true;
