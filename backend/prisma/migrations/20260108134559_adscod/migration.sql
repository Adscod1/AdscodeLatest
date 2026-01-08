-- AlterTable
ALTER TABLE `product` ADD COLUMN `barcode` VARCHAR(191) NULL,
    ADD COLUMN `benefitsIntroText` TEXT NULL,
    ADD COLUMN `benefitsSectionImage` VARCHAR(191) NULL,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `condition` VARCHAR(191) NULL,
    ADD COLUMN `continueSellingWhenOutOfStock` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `currency` VARCHAR(191) NULL,
    ADD COLUMN `howToUseDescription` TEXT NULL,
    ADD COLUMN `howToUseVideo` VARCHAR(191) NULL,
    ADD COLUMN `isScheduled` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `lowStockAlert` INTEGER NULL,
    ADD COLUMN `model` VARCHAR(191) NULL,
    ADD COLUMN `offerFreeShipping` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `processingTime` VARCHAR(191) NULL,
    ADD COLUMN `productId` VARCHAR(191) NULL,
    ADD COLUMN `requiresShipping` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `scheduledPublishDate` DATETIME(3) NULL,
    ADD COLUMN `scheduledUnpublishDate` DATETIME(3) NULL,
    ADD COLUMN `shippingCost` DOUBLE NULL,
    ADD COLUMN `shippingMethod` VARCHAR(191) NULL,
    ADD COLUMN `sku` VARCHAR(191) NULL,
    ADD COLUMN `specifications` TEXT NULL,
    ADD COLUMN `stockQuantity` INTEGER NULL,
    ADD COLUMN `taxRate` DOUBLE NULL,
    ADD COLUMN `trackQuantity` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `warranty` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `product_benefit` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    INDEX `product_benefit_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_ingredient` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    INDEX `product_ingredient_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_faq` (
    `id` VARCHAR(191) NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    INDEX `product_faq_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_benefit` ADD CONSTRAINT `product_benefit_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_ingredient` ADD CONSTRAINT `product_ingredient_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_faq` ADD CONSTRAINT `product_faq_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
