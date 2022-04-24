/*
  Warnings:

  - You are about to drop the column `description` on the `Specialist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Specialist` DROP COLUMN `description`,
    ADD COLUMN `about` VARCHAR(1000) NULL;
