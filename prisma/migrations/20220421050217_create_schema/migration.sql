-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `confirmed` BOOLEAN NULL DEFAULT false,
    `disabled` BOOLEAN NULL DEFAULT false,
    `specialistId` INTEGER NOT NULL,
    `patientId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Call` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `duration` DECIMAL(65, 30) NULL,
    `rating` DECIMAL(2, 2) NULL,
    `scheduleId` INTEGER NOT NULL,

    UNIQUE INDEX `Call_scheduleId_key`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specialty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `specialty` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specialist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `birth` DATE NOT NULL,
    `gender` ENUM('F', 'M') NOT NULL,
    `description` VARCHAR(1000) NULL,
    `avatarUrl` VARCHAR(200) NULL,
    `cost` DECIMAL(5, 2) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `crp` VARCHAR(191) NULL,
    `crm` VARCHAR(191) NULL,

    UNIQUE INDEX `un_clg_especialista_email`(`email`),
    UNIQUE INDEX `Specialist_cnpj_key`(`cnpj`),
    UNIQUE INDEX `Specialist_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecialistSpecialty` (
    `specialtyId` INTEGER NOT NULL,
    `specialistId` INTEGER NOT NULL,

    PRIMARY KEY (`specialtyId`, `specialistId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `birth` DATE NOT NULL,
    `gender` ENUM('F', 'M') NOT NULL,
    `avatarUrl` VARCHAR(200) NULL,
    `cpf` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Patient_email_key`(`email`),
    UNIQUE INDEX `Patient_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `observation` VARCHAR(100) NULL,
    `diagnosis` VARCHAR(100) NOT NULL,
    `callId` INTEGER NOT NULL,

    UNIQUE INDEX `Chart_callId_key`(`callId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_specialistId_fkey` FOREIGN KEY (`specialistId`) REFERENCES `Specialist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Call` ADD CONSTRAINT `Call_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpecialistSpecialty` ADD CONSTRAINT `SpecialistSpecialty_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `Specialty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpecialistSpecialty` ADD CONSTRAINT `SpecialistSpecialty_specialistId_fkey` FOREIGN KEY (`specialistId`) REFERENCES `Specialist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chart` ADD CONSTRAINT `Chart_callId_fkey` FOREIGN KEY (`callId`) REFERENCES `Call`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
