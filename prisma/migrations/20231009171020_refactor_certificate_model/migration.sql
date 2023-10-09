/*
  Warnings:

  - You are about to drop the column `title` on the `certificates` table. All the data in the column will be lost.
  - Added the required column `content` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "certificates" RENAME COLUMN "title" TO "content";
ALTER TABLE "certificates" ALTER COLUMN "total_hour" DROP NOT NULL,
ALTER COLUMN "date_string" DROP NOT NULL;
