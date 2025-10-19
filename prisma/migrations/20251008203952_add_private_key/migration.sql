/*
  Warnings:

  - A unique constraint covering the columns `[public_key]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public_key` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "public_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Site_public_key_key" ON "Site"("public_key");
