CREATE TABLE `permission` (
  `id` integer PRIMARY KEY,
  `name` text,
  `description` text,
  `method` text,
  `url` text,
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `user` (
  `id` integer PRIMARY KEY,
  `firstName` varchar(255),
  `lastName` varchar(255),
  `description` varchar(255),
  `email` varchar(255),
  `gender` varchar(255),
  `age` integer,
  `username` varchar(255),
  `password` varchar(255),
  `roleId` integer COMMENT '1 / 2 / 3',
  `refreshToken` varchar(255),
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `roles` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `description` text,
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `role_to_permission` (
  `roleId` integer,
  `permissionId` integer,
  `created_at` datetime,
  `updatedAt` datetime,
  PRIMARY KEY (`roleId`, `permissionId`)
);

CREATE TABLE `category_course` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `description` text,
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `courses` (
  `id` integer PRIMARY KEY,
  `categoryCourseId` int,
  `name` varchar(255),
  `summary` text,
  `assignedBy` varchar(255),
  `durationInMinute` integer,
  `startDate` datetime,
  `endDate` datetime,
  `description` text,
  `locationPath` text,
  `prepare` text,
  `price` decimal(15,2),
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `category_lession` (
  `id` integer PRIMARY KEY,
  `courseId` integer,
  `name` text,
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `lessons` (
  `id` integer PRIMARY KEY,
  `lessionCategoryId` integer,
  `name` varchar(255),
  `description` text,
  `type` varchar(255),
  `content` text,
  `order` integer,
  `locationPath` text,
  `uploadedBy` integer,
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `enrollments` (
  `id` integer,
  `courseId` integer,
  `userId` integer,
  `enrollment_date` datetime,
  `percentage_progess` integer
);

CREATE TABLE `course_progress` (
  `enrollmentId` integer,
  `lessionId` integer,
  `completed_at` datetime
);

CREATE TABLE `category_exam` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `description` text,
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `exams` (
  `id` integer PRIMARY KEY,
  `categoryExamId` integer,
  `lessionCategoryId` integer,
  `name` varchar(255),
  `description` text,
  `durationInMinute` int,
  `pointToPass` int,
  `createrID` bigint,
  `numberOfAttempt` tinyint,
  `createdAt` datetime,
  `updatedAt` datetime
);

ALTER TABLE `user` ADD FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`);

ALTER TABLE `role_to_permission` ADD FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`);

ALTER TABLE `role_to_permission` ADD FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`);

ALTER TABLE `courses` ADD FOREIGN KEY (`categoryCourseId`) REFERENCES `category_course` (`id`);

ALTER TABLE `category_lession` ADD FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`);

ALTER TABLE `lessons` ADD FOREIGN KEY (`lessionCategoryId`) REFERENCES `category_lession` (`id`);

ALTER TABLE `exams` ADD FOREIGN KEY (`lessionCategoryId`) REFERENCES `lessons` (`id`);

ALTER TABLE `exams` ADD FOREIGN KEY (`categoryExamId`) REFERENCES `category_exam` (`id`);

ALTER TABLE `enrollments` ADD FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`);

ALTER TABLE `enrollments` ADD FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

ALTER TABLE `course_progress` ADD FOREIGN KEY (`enrollmentId`) REFERENCES `enrollments` (`id`);

ALTER TABLE `course_progress` ADD FOREIGN KEY (`lessonId`) REFERENCES `lessons` (`id`);
