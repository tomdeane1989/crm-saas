/*
  Warnings:

  - You are about to drop the column `notes` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `Embedding` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `Embedding` table. All the data in the column will be lost.
  - The `vector` column on the `Embedding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `stage` on the `Opportunity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Opportunity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Embedding_entityType_entityId_idx";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "notes",
DROP COLUMN "updatedAt",
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "details" TEXT,
ALTER COLUMN "occurredAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "externalId" TEXT;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "role" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Embedding" DROP COLUMN "entityId",
DROP COLUMN "entityType",
ADD COLUMN     "metadata" JSONB,
DROP COLUMN "vector",
ADD COLUMN     "vector" DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "stage",
ADD COLUMN     "contactId" INTEGER,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Activity_type_idx" ON "Activity"("type");

-- CreateIndex
CREATE INDEX "Activity_occurredAt_idx" ON "Activity"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Company_externalId_key" ON "Company"("externalId");

-- CreateIndex
CREATE INDEX "Company_externalId_idx" ON "Company"("externalId");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_externalId_key" ON "Contact"("externalId");

-- CreateIndex
CREATE INDEX "Contact_externalId_idx" ON "Contact"("externalId");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Embedding_createdAt_idx" ON "Embedding"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_externalId_key" ON "Opportunity"("externalId");

-- CreateIndex
CREATE INDEX "Opportunity_externalId_idx" ON "Opportunity"("externalId");

-- CreateIndex
CREATE INDEX "Opportunity_status_idx" ON "Opportunity"("status");

-- CreateIndex
CREATE INDEX "Opportunity_closeDate_idx" ON "Opportunity"("closeDate");

-- CreateIndex
CREATE INDEX "PromptLog_model_idx" ON "PromptLog"("model");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
