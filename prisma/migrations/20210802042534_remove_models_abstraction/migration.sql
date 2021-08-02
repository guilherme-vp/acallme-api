/*
  Warnings:

  - You are about to drop the column `userId` on the `pacients` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `specialists` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `pacients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `pacients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `specialists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `specialists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birth` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth` to the `specialists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `specialists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `specialists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `specialists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `specialists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `specialists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `specialists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pacients" DROP CONSTRAINT "pacients_userId_fkey";

-- DropForeignKey
ALTER TABLE "specialists" DROP CONSTRAINT "specialists_userId_fkey";

-- DropIndex
DROP INDEX "pacients.userId_unique";

-- DropIndex
DROP INDEX "specialists.userId_unique";

-- AlterTable
ALTER TABLE "pacients" DROP COLUMN "userId",
ADD COLUMN     "birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "is_email_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "specialists" DROP COLUMN "userId",
ADD COLUMN     "birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "is_email_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "is_tour_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "pacients.email_unique" ON "pacients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pacients.cpf_unique" ON "pacients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "specialists.email_unique" ON "specialists"("email");

-- CreateIndex
CREATE UNIQUE INDEX "specialists.cpf_unique" ON "specialists"("cpf");
