-- AlterTable
ALTER TABLE `Patient` MODIFY `gender` ENUM('F', 'M', 'NB') NOT NULL;

-- AlterTable
ALTER TABLE `Specialist` MODIFY `gender` ENUM('F', 'M', 'NB') NOT NULL;
