-- CreateTable
CREATE TABLE `campaign` (
    `id` VARCHAR(191) NOT NULL,
    `brandId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `budget` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'UGX',
    `duration` INTEGER NULL,
    `influencerLocation` JSON NULL,
    `platforms` JSON NULL,
    `targets` JSON NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `campaign_brandId_idx`(`brandId`),
    INDEX `campaign_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaign_influencer` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `influencerId` VARCHAR(191) NOT NULL,
    `applicationStatus` ENUM('APPLIED', 'SELECTED', 'NOT_SELECTED', 'WITHDRAWN') NOT NULL DEFAULT 'APPLIED',
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `selectedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `campaign_influencer_campaignId_idx`(`campaignId`),
    INDEX `campaign_influencer_influencerId_idx`(`influencerId`),
    INDEX `campaign_influencer_applicationStatus_idx`(`applicationStatus`),
    UNIQUE INDEX `campaign_influencer_campaignId_influencerId_key`(`campaignId`, `influencerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('CAMPAIGN_SELECTION', 'APPLICATION_UPDATE', 'SYSTEM') NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(191) NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notification_userId_idx`(`userId`),
    INDEX `notification_read_idx`(`read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `campaign` ADD CONSTRAINT `campaign_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_influencer` ADD CONSTRAINT `campaign_influencer_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `campaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaign_influencer` ADD CONSTRAINT `campaign_influencer_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `influencer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
