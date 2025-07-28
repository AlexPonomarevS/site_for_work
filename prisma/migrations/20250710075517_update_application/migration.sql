-- CreateEnum
CREATE TYPE "Section" AS ENUM ('DEFAULT', 'PGR', 'ARCHIVE', 'GARANTIA', 'GARANTIA_IBP');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "section" "Section" NOT NULL DEFAULT 'DEFAULT';
