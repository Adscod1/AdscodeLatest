-- AlterTable
ALTER TABLE `campaign` ADD COLUMN `type` ENUM('PRODUCT', 'COUPON', 'VIDEO', 'PROFILE') NOT NULL DEFAULT 'PRODUCT',
    ADD COLUMN `typeSpecificData` JSON NULL;

-- CreateIndex
CREATE INDEX `campaign_type_idx` ON `campaign`(`type`);
