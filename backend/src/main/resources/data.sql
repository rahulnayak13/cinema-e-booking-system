SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS `cinema`;
USE `cinema`;

-- user_status
DROP TABLE IF EXISTS `user_status`;
CREATE TABLE `user_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `user_status` VALUES (1,'active'),(2,'inactive'),(3,'suspended');

-- user_types
DROP TABLE IF EXISTS `user_types`;
CREATE TABLE `user_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `user_types` VALUES (1,'admin'),(2,'customer');

DROP TABLE IF EXISTS `base_user`;
CREATE TABLE `base_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `user_type_id` INT NOT NULL,
  `status_id` INT NOT NULL,
  `verification_token` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_role` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `user_status`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO base_user (
    created_at,
    updated_at,
    email,
    first_name,
    last_name,
    password_hash,
    phone,
    user_type_id,
    status_id
) VALUES (
    '2026-03-31 12:00:00',
    '2026-03-31 12:00:00',
    'admin1@test.com',
    'Alice',
    'Admin',
    '$2a$12$yyWveEXS1BE44gkWTpNGXe5NxxpWRrA4Ch2J9oEvERUOwFYCCthLK',
    '111-111-1111',
    0,
    0
);
-- addresses
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `base_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `addresses` VALUES
(1,1,'123 Admin St','AdminCity','AC','11111'),
(2,2,'456 User Ln','UserCity','UC','22222');

-- movie
DROP TABLE IF EXISTS `movie`;
CREATE TABLE `movie` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `status` enum('COMING_SOON','CURRENTLY_RUNNING') DEFAULT NULL,
  `trailer_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `movie` (id, title, description, poster_url, rating, status, trailer_url) VALUES
(1,'Neon Heist','A high-tech crew pulls one last job in a city that never sleeps.','https://picsum.photos/seed/neonheist/600/900','PG-13','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(2,'Lunar Letters','Two strangers exchange messages through a moon relay.','https://picsum.photos/seed/lunarletters/600/900','PG','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(3,'Circuit Breakers','A rookie engineer uncovers the truth behind a citywide AI blackout.','https://picsum.photos/seed/circuitbreakers/600/900','PG-13','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(4,'Peach State Mysteries','A small-town rumor turns into a big-time whodunit.','https://picsum.photos/seed/peachstate/600/900','PG-13','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(5,'Garden of Giants','Kids discover a greenhouse where plants grow to impossible sizes.','https://picsum.photos/seed/garden/600/900','PG','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(6,'Midnight Atlas','A mapmaker learns the world changes whenever the ink dries.','https://picsum.photos/seed/atlas/600/900','PG-13','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(7,'After the Encore','A singer faces the quiet moments after sudden fame.','https://picsum.photos/seed/encore/600/900','PG','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(8,'Cold Case: Redwood','A detective reopens a case the town wants buried.','https://picsum.photos/seed/redwood/600/900','R','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(9,'Chef’s Table: Fire & Stone','A burnt-out chef restarts with a food truck and stubborn team.','https://picsum.photos/seed/chefs/600/900','PG-13','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(10,'Skyline Sprint','A runner joins an underground rooftop race to save a friend.','https://picsum.photos/seed/skyline/600/900','PG-13','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ');
-- movie_genres
DROP TABLE IF EXISTS `movie_genres`;
CREATE TABLE `movie_genres` (
  `movie_id` bigint NOT NULL,
  `genres` varchar(255) DEFAULT NULL,
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `movie_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `movie_genres` VALUES
(1,'Action'),(1,'Thriller'),
(2,'Drama'),(2,'Romance');

-- movie_show_dates
DROP TABLE IF EXISTS `movie_show_dates`;
CREATE TABLE `movie_show_dates` (
  `movie_id` bigint NOT NULL,
  `show_dates` date DEFAULT NULL,
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `movie_show_dates_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `movie_show_dates` VALUES
(1,'2026-02-26'),(1,'2026-02-27'),
(2,'2026-02-25'),(2,'2026-02-26');

-- movie_showtimes
DROP TABLE IF EXISTS `movie_showtimes`;
CREATE TABLE `movie_showtimes` (
  `movie_id` bigint NOT NULL,
  `showtimes` varchar(255) DEFAULT NULL,
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `movie_showtimes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `movie_showtimes` VALUES
(1,'2:00 PM'),(1,'5:00 PM'),(1,'8:00 PM'),
(2,'2:00 PM'),(2,'5:00 PM'),(2,'8:00 PM');

-- favorites
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `movie_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`movie_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `base_user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `favorites` VALUES (2,1),(2,2);

-- email_verifications
DROP TABLE IF EXISTS `email_verifications`;
CREATE TABLE `email_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `email_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `base_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `email_verifications` VALUES
(1,3,'VERIFICATIONTOKEN123','2026-03-30 19:39:00','2026-03-29 23:39:00');

-- payment_cards
DROP TABLE IF EXISTS `payment_cards`;
CREATE TABLE `payment_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `card_number` varbinary(255) DEFAULT NULL,
  `card_holder_name` varchar(255) DEFAULT NULL,
  `expiry_date` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `base_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;