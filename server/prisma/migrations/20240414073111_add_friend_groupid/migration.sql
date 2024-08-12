/*
  Warnings:

  - Added the required column `group_id` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "group_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
