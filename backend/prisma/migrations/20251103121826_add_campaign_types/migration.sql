-- AlterTable
ALTER TABLE `campaign` ADD COLUMN `type` ENUM('PRODUCT', 'COUPON', 'VIDEO', 'PROFILE') NOT NULL DEFAULT 'PRODUCT',
    ADD COLUMN `typeSpecificData` JSON NULL;

-- Update existing campaigns to ensure they have type set to PRODUCT
UPDATE `campaign` SET `type` = 'PRODUCT' WHERE `type` IS NULL OR `type` = '';

-- CreateIndex
CREATE INDEX `campaign_type_idx` ON `campaign`(`type`);
