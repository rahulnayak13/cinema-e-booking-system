SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS `cinema`;
USE `cinema`;

-- cleanup existing tables
DROP TABLE IF EXISTS `payment_cards`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `email_verifications`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `movie_showtimes`;
DROP TABLE IF EXISTS `movie_show_dates`;
DROP TABLE IF EXISTS `movie_genres`;
DROP TABLE IF EXISTS `movie_preferences`;
DROP TABLE IF EXISTS `movie`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `customer`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `base_user`;
DROP TABLE IF EXISTS `user_types`;
DROP TABLE IF EXISTS `user_status`;

-- user_status
CREATE TABLE `user_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `user_status` VALUES (1,'active'),(2,'inactive'),(3,'suspended');

-- user_types
CREATE TABLE `user_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `user_types` VALUES (1,'admin'),(2,'customer');

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `user_type_id` int NOT NULL,
  `status_id` int NOT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`id`),
  CONSTRAINT `fk_users_status` FOREIGN KEY (`status_id`) REFERENCES `user_status`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `admin` (
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `admin_fk_user` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `customer` (
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `customer_fk_user` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (
  created_at, updated_at, email, first_name, last_name, password_hash, phone, user_type_id, status_id
) VALUES
('2026-03-31 12:00:00','2026-03-31 12:00:00','admin1@test.com','Alice','Admin','$2a$12$yyWveEXS1BE44gkWTpNGXe5NxxpWRrA4Ch2J9oEvERUOwFYCCthLK','1111111111',1,1),
('2026-03-31 12:00:00','2026-03-31 12:00:00','user1@test.com','Bob','User','$2a$12$yyWveEXS1BE44gkWTpNGXe5NxxpWRrA4Ch2J9oEvERUOwFYCCthLK','2222222222',2,1),
('2026-03-31 12:00:00','2026-03-31 12:00:00','user2@test.com','Charlie','User','$2a$12$yyWveEXS1BE44gkWTpNGXe5NxxpWRrA4Ch2J9oEvERUOwFYCCthLK','3333333333',2,2);

INSERT INTO admin (id) VALUES (1);
INSERT INTO customer (id) VALUES (2), (3);

-- addresses
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `addresses` VALUES
(1,1,'123 Admin St','AdminCity','AC','11111'),
(2,2,'456 User Ln','UserCity','UC','22222');

-- movies
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
(3,'Midnight Atlas','A mapmaker learns the world changes whenever the ink dries.','https://picsum.photos/seed/atlas/600/900','PG-13','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ');

CREATE TABLE `movie_genres` (
  `movie_id` bigint NOT NULL,
  `genres` varchar(255) DEFAULT NULL,
  CONSTRAINT `FK_genre_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `movie_genres` VALUES
(1,'Action'),(1,'Thriller'),(2,'Drama'),(2,'Romance'),(3,'Fantasy');

CREATE TABLE `movie_show_dates` (
  `movie_id` bigint NOT NULL,
  `show_dates` date DEFAULT NULL,
  CONSTRAINT `FK_show_dates_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `movie_show_dates` VALUES
(1,'2026-04-03'),(1,'2026-04-04'),(2,'2026-04-03'),(3,'2026-04-10');

CREATE TABLE `movie_showtimes` (
  `movie_id` bigint NOT NULL,
  `showtimes` varchar(255) DEFAULT NULL,
  CONSTRAINT `FK_showtimes_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `movie_showtimes` VALUES
(1,'2:00 PM'),(1,'5:00 PM'),(2,'3:00 PM'),(3,'8:00 PM');

-- favorites
CREATE TABLE `favorites` (
  `user_id` bigint NOT NULL,
  `movie_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`movie_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `favorites` VALUES (2,1),(2,2);

-- email_verifications
CREATE TABLE `email_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `email_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `email_verifications` VALUES
(1,3,'VERIFICATIONTOKEN123','2026-04-30 19:39:00','2026-04-01 23:39:00');

-- payment_cards
CREATE TABLE `payment_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `card_number` varbinary(255) DEFAULT NULL,
  `card_holder_name` varchar(255) DEFAULT NULL,
  `expiry_date` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `movie_preferences` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `genre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `movie_preferences_customer_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

