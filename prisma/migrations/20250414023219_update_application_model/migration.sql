/*
  Warnings:

  - The values [PENDING,PROGRESS,COMPLETED] on the enum `StatusApplication` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusApplication_new" AS ENUM ('WORK', 'CLOSED', 'OPEN', 'FORMALIZED_PGR_WAIT', 'FORMALIZED_POESO_GARANTIA', 'FORMALIZED_POESO_PGR', 'FORMALIZED_POESO_REPLACEMENT', 'FORMALIZED_POESO_CONSULTATION', 'FORMALIZED_POESO_VR_GARANTIA', 'FORMALIZED_POESO_VR_PGR', 'FORMALIZED_POESO_REPAIR_KSA_WITHOUT_ZIP', 'FORMALIZED_POESO_REPAIR_KSA_WITH_ZIP', 'FORMALIZED_DEV_REQUEST');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "StatusApplication_new" USING ("status"::text::"StatusApplication_new");
ALTER TYPE "StatusApplication" RENAME TO "StatusApplication_old";
ALTER TYPE "StatusApplication_new" RENAME TO "StatusApplication";
DROP TYPE "StatusApplication_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "client" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
