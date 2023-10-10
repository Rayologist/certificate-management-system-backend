/*
  Warnings:

  - Added the required column `template_id` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
BEGIN;
-- AlterTable
ALTER TABLE "certificates" ADD COLUMN "template_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "name_position_y" INTEGER NOT NULL,
    "title_upper_limit_y" INTEGER NOT NULL,
    "title_lower_limit_y" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

INSERT INTO templates (filename, name_position_y, title_upper_limit_y, title_lower_limit_y) VALUES ('template.png', 1010, 1100, 1880);

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "certificates" ALTER COLUMN "template_id" DROP DEFAULT;

COMMIT;
