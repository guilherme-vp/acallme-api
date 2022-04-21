/*
  Warnings:

  - You are about to drop the column `specialty` on the `Specialty` table. All the data in the column will be lost.
  - Added the required column `name` to the `Specialty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Specialty` DROP COLUMN `specialty`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
