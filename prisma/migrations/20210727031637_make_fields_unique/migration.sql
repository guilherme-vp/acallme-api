/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `specialists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[crp]` on the table `specialists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[crm]` on the table `specialists` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cpf` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cpf" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.cpf_unique" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "specialists.cnpj_unique" ON "specialists"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "specialists.crp_unique" ON "specialists"("crp");

-- CreateIndex
CREATE UNIQUE INDEX "specialists.crm_unique" ON "specialists"("crm");

-- AlterIndex
ALTER INDEX "pacients_userId_unique" RENAME TO "pacients.userId_unique";

-- AlterIndex
ALTER INDEX "specialists_userId_unique" RENAME TO "specialists.userId_unique";
