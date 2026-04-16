SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS `cinema`;
USE `cinema`;

-- user_status
CREATE TABLE IF NOT EXISTS `user_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO `user_status` VALUES (1,'active'),(2,'inactive'),(3,'suspended');

-- user_types
CREATE TABLE IF NOT EXISTS `user_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO `user_types` VALUES (1,'admin'),(2,'customer');

CREATE TABLE IF NOT EXISTS `users` (
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

CREATE TABLE IF NOT EXISTS `admin` (
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `admin_fk_user` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `customer` (
  `id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `customer_fk_user` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO users (
  id, created_at, updated_at, email, first_name, last_name, password_hash, phone, user_type_id, status_id
) VALUES
(1,'2026-03-31 12:00:00','2026-03-31 12:00:00','admin1@test.com','Alice','Admin','$2a$12$yyWveEXS1BE44gkWTpNGXe5NxxpWRrA4Ch2J9oEvERUOwFYCCthLK','1111111111',1,1),
(2,'2026-03-31 12:00:00','2026-03-31 12:00:00','user1@test.com','Bob','User','$2a$12$yyWveEXS1BE44gkWTpNGXe5NxxpWRrA4Ch2J9oEvERUOwFYCCthLK','2222222222',2,1),
(3,'2026-03-31 12:00:00','2026-03-31 12:00:00','user2@test.com','Charlie','User','$2a$12$yyWveEXS1BE44gkWTpNGXe5NxxpWRrA4Ch2J9oEvERUOwFYCCthLK','3333333333',2,2);

INSERT IGNORE INTO admin (id) VALUES (1);
INSERT IGNORE INTO customer (id) VALUES (2), (3);

-- addresses
CREATE TABLE IF NOT EXISTS `addresses` (
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
INSERT IGNORE INTO `addresses` VALUES
(1,1,'123 Admin St','AdminCity','AC','11111'),
(2,2,'456 User Ln','UserCity','UC','22222');

-- movies
CREATE TABLE IF NOT EXISTS `movie` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `status` enum('COMING_SOON','CURRENTLY_RUNNING') DEFAULT NULL,
  `trailer_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO `movie` (id, title, description, poster_url, rating, status, trailer_url) VALUES
(1,'Neon Heist','A high-tech crew pulls one last job in a city that never sleeps.','https://picsum.photos/seed/neonheist/600/900','PG-13','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(2,'Lunar Letters','Two strangers exchange messages through a moon relay.','https://picsum.photos/seed/lunarletters/600/900','PG','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(3,'Midnight Atlas','A mapmaker learns the world changes whenever the ink dries.','https://picsum.photos/seed/atlas/600/900','PG-13','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(4,'Peach State Mysteries','A small-town rumor turns into a big-time whodunit.','https://picsum.photos/seed/peachstate/600/900','PG-13','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(5,'Garden of Giants','Kids discover a greenhouse where plants grow to impossible sizes.','https://picsum.photos/seed/garden/600/900','PG','CURRENTLY_RUNNING','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(6,'After the Encore','A singer faces the quiet moments after sudden fame.','https://picsum.photos/seed/encore/600/900','PG','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(7,'Cold Case: Redwood','A detective reopens a case the town wants buried.','https://picsum.photos/seed/redwood/600/900','R','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(8,'Chef’s Table: Fire & Stone','A burnt-out chef restarts with a food truck and stubborn team.','https://picsum.photos/seed/chefs/600/900','PG-13','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ'),
(9,'Skyline Sprint','A runner joins an underground rooftop race to save a friend.','https://picsum.photos/seed/skyline/600/900','PG-13','COMING_SOON','https://www.youtube.com/embed/dQw4w9WgXcQ');

CREATE TABLE IF NOT EXISTS `movie_genres` (
  `movie_id` bigint PRIMARY KEY,
  `genre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (movie_id, genre),

  CONSTRAINT `FK_genre_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO `movie_genres` VALUES
(1,'Action'),(1,'Thriller'),(2,'Drama'),(2,'Romance'),(3,'Fantasy');

CREATE TABLE IF NOT EXISTS `showroom` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100),
  `capacity` INT NOT NULL
);

-- showtimes
CREATE TABLE IF NOT EXISTS `showtime` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `movie_id` BIGINT NOT NULL,
  `showroom_id` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  
  CONSTRAINT `fk_showtime_movie`
    FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE CASCADE,

  CONSTRAINT `fk_showtime_showroom`
    FOREIGN KEY (`showroom_id`) REFERENCES `showroom`(`id`) ON DELETE CASCADE,

  UNIQUE (`showroom_id`, `start_time`) -- prevents conflicts
);

-- seats
CREATE TABLE IF NOT EXISTS `seat` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `showroom_id` INT NOT NULL,
  `row_label` CHAR(1) NOT NULL,
  `seat_number` INT NOT NULL,

  CONSTRAINT `fk_seat_showroom`
    FOREIGN KEY (`showroom_id`) REFERENCES `showroom`(`id`) ON DELETE CASCADE,

  UNIQUE (showroom_id, row_label, seat_number)
);

-- bookings
CREATE TABLE IF NOT EXISTS `booking` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT,
  `showtime_id` BIGINT NOT NULL,
  `total_price` DECIMAL(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT `fk_booking_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,

  CONSTRAINT `fk_booking_showtime`
    FOREIGN KEY (`showtime_id`) REFERENCES `showtime`(`id`) ON DELETE CASCADE
);

-- booking < - > seat composite
CREATE TABLE IF NOT EXISTS `booking_seat` (
  `booking_id` BIGINT NOT NULL,
  `seat_id` BIGINT NOT NULL,

  PRIMARY KEY (`booking_id`, `seat_id`),

  CONSTRAINT `fk_bs_booking`
    FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON DELETE CASCADE,

  CONSTRAINT `fk_bs_seat`
    FOREIGN KEY (`seat_id`) REFERENCES `seat`(`id`) ON DELETE CASCADE
);

-- ticket types
CREATE TABLE IF NOT EXISTS `ticket_type` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50),
  `price` DECIMAL(5,2)
);
INSERT IGNORE INTO ticket_type (name, price) VALUES
('Adult', 12.99),
('Child', 8.99),
('Senior', 9.99);

-- tickets per booking per type
CREATE TABLE IF NOT EXISTS `booking_ticket` (
  `booking_id` BIGINT NOT NULL,
  `ticket_type_id` INT NOT NULL,
  `quantity` INT NOT NULL,

  PRIMARY KEY (`booking_id`, `ticket_type_id`),

  FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_type`(`id`)
);

-- favorites
CREATE TABLE IF NOT EXISTS `favorites` (
  `user_id` bigint NOT NULL,
  `movie_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`movie_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO `favorites` VALUES (2,1),(2,2);

-- email_verifications
CREATE TABLE IF NOT EXISTS `email_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `email_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- payment_cards
CREATE TABLE IF NOT EXISTS `payment_cards` (
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

CREATE TABLE IF NOT EXISTS `movie_preferences` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `genre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `movie_preferences_customer_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



SET FOREIGN_KEY_CHECKS = 1;