/*
  Warnings:

  - Added the required column `name` to the `Groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "name" TEXT NOT NULL;
