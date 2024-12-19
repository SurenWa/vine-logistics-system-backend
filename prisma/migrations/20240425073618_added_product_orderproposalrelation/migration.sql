-- AddForeignKey
ALTER TABLE `OrderProposal` ADD CONSTRAINT `OrderProposal_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
