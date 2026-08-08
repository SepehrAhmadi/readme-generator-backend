-- AlterTable
ALTER TABLE `generationjob` ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `errorMessage` TEXT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';
