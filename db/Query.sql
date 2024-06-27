INSERT INTO category_course VALUES
(1, 'Back-End', 'Include Back-End courses', '2024-04-28', '2024-04-28')
(2, 'Front-End', 'Include Front-End courses', '2024-04-28', '2024-04-28')

INSERT INTO courses VALUES
(1, 1, 'NodeJS', 'NodeJS Learning', 'ngmiho', 30, '2024-04-28', '2024-05-12', 'NodeJS Description', 'path', 'Visual Studio Code', 0, '2024-04-28', '2024-04-28')

INSERT INTO category_lession VALUES
(1, 1, 'beginning', '2024-04-28', NULL)

INSERT INTO lessions VALUES 
(9, 1, 'Lecture 01: Advice before start', 'Some advices before start', 'VIDEO', 'JavaScript', 1, 'path', 1, '2024-04-28'. '2024-04-28')

INSERT INTO lessions (id, lessionCategoryId, `name`, `description`, `type`, content, `order`, locationPath, uploadedBy, createdAt) 
VALUES (9, 1, 'Lecture 01: Advice before start', 'Some advices before start', 'VIDEO', 'JavaScript', 1, 'path', 1, '2024-04-28')