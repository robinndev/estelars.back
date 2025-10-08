/*
  Warnings:

  - You are about to drop the column `email` on the `Site` table. All the data in the column will be lost.
  - Added the required column `email_address` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Site" DROP COLUMN "email",
ADD COLUMN     "email_address" TEXT NOT NULL;
