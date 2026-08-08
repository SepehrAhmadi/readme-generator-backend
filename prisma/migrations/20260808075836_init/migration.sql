-- CreateTable
CREATE TABLE `Repository` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `primaryLanguage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Repository_fullName_key`(`fullName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenerationJob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `repositoryId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneratedReadme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobId` INTEGER NOT NULL,
    `content` LONGTEXT NOT NULL,
    `totalTokens` INTEGER NOT NULL,
    `modelUsed` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GeneratedReadme_jobId_key`(`jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GenerationJob` ADD CONSTRAINT `GenerationJob_repositoryId_fkey` FOREIGN KEY (`repositoryId`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GeneratedReadme` ADD CONSTRAINT `GeneratedReadme_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `GenerationJob`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
