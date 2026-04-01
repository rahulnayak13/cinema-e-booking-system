-- Drop and recreate the database
DROP DATABASE IF EXISTS cinema;
CREATE DATABASE cinema;
USE cinema;

-- Disable foreign key checks while creating tables and inserting data
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------
-- 1️⃣ Base tables
-- -----------------------------
CREATE TABLE user_status (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE user_types (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(100) DEFAULT NULL,
  last_name varchar(100) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  user_type_id int DEFAULT NULL,
  status_id int DEFAULT '2',
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY user_type_id (user_type_id),
  KEY status_id (status_id),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (user_type_id) REFERENCES user_types (id),
  CONSTRAINT users_ibfk_2 FOREIGN KEY (status_id) REFERENCES user_status (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE movie (
  id bigint NOT NULL AUTO_INCREMENT,
  description varchar(2000) DEFAULT NULL,
  poster_url varchar(255) DEFAULT NULL,
  rating varchar(255) DEFAULT NULL,
  status enum('COMING_SOON','CURRENTLY_RUNNING') DEFAULT NULL,
  title varchar(255) DEFAULT NULL,
  trailer_url varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------
-- 2️⃣ Dependent tables
-- -----------------------------
CREATE TABLE addresses (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  street varchar(255) DEFAULT NULL,
  city varchar(100) DEFAULT NULL,
  state varchar(100) DEFAULT NULL,
  zip_code varchar(20) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY user_id (user_id),
  CONSTRAINT addresses_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE email_verifications (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  token varchar(255) NOT NULL,
  expires_at datetime NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT email_verifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE favorites (
  user_id int NOT NULL,
  movie_id bigint NOT NULL,
  PRIMARY KEY (user_id,movie_id),
  KEY movie_id (movie_id),
  CONSTRAINT favorites_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT favorites_ibfk_2 FOREIGN KEY (movie_id) REFERENCES movie (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE payment_cards (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  card_number varbinary(255) DEFAULT NULL,
  card_holder_name varchar(255) DEFAULT NULL,
  expiry_date varchar(10) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT payment_cards_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE movie_genres (
  movie_id bigint NOT NULL,
  genres varchar(255) DEFAULT NULL,
  KEY movie_id_fk (movie_id),
  CONSTRAINT movie_genres_ibfk_1 FOREIGN KEY (movie_id) REFERENCES movie (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE movie_show_dates (
  movie_id bigint NOT NULL,
  show_dates date DEFAULT NULL,
  KEY movie_id_fk (movie_id),
  CONSTRAINT movie_show_dates_ibfk_1 FOREIGN KEY (movie_id) REFERENCES movie (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE movie_showtimes (
  movie_id bigint NOT NULL,
  showtimes varchar(255) DEFAULT NULL,
  KEY movie_id_fk (movie_id),
  CONSTRAINT movie_showtimes_ibfk_1 FOREIGN KEY (movie_id) REFERENCES movie (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE password_resets (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  token varchar(255) DEFAULT NULL,
  expires_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT password_resets_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -----------------------------
-- 3️⃣ Insert data
-- -----------------------------
INSERT INTO user_status VALUES (1,'active'),(2,'inactive'),(3,'suspended');
INSERT INTO user_types VALUES (1,'admin'),(2,'customer');

INSERT INTO users VALUES 
  (1,'admin1@test.com','hashed_password1','Alice','Admin','2026-03-29 23:38:04',1,1),
  (2,'user1@test.com','hashed_password2','Bob','User','2026-03-29 23:38:04',2,1),
  (3,'user2@test.com','hashed_password3','Charlie','User','2026-03-29 23:38:04',2,2);

INSERT INTO addresses VALUES 
  (1,1,'123 Admin St','AdminCity','AC','11111'),
  (2,2,'456 User Ln','UserCity','UC','22222');

INSERT INTO email_verifications VALUES 
  (1,3,'VERIFICATIONTOKEN123','2026-03-30 19:39:00','2026-03-29 23:39:00');

INSERT INTO favorites VALUES 
  (2,1),(2,2);

INSERT INTO movie VALUES
  (1,'A high-tech crew pulls one last job in a city that never sleeps.','https://picsum.photos/seed/neonheist/600/900','PG-13','CURRENTLY_RUNNING','Neon Heist','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (2,'Two strangers exchange messages through a moon relay.','https://picsum.photos/seed/lunarletters/600/900','PG','CURRENTLY_RUNNING','Lunar Letters','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (3,'A rookie engineer uncovers the truth behind a citywide AI blackout.','https://picsum.photos/seed/circuitbreakers/600/900','PG-13','CURRENTLY_RUNNING','Circuit Breakers','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (4,'A small-town rumor turns into a big-time whodunit.','https://picsum.photos/seed/peachstate/600/900','PG-13','CURRENTLY_RUNNING','Peach State Mysteries','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (5,'Kids discover a greenhouse where plants grow to impossible sizes.','https://picsum.photos/seed/garden/600/900','PG','CURRENTLY_RUNNING','Garden of Giants','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (6,'A mapmaker learns the world changes whenever the ink dries.','https://picsum.photos/seed/atlas/600/900','PG-13','COMING_SOON','Midnight Atlas','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (7,'A singer faces the quiet moments after sudden fame.','https://picsum.photos/seed/encore/600/900','PG','COMING_SOON','After the Encore','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (8,'A detective reopens a case the town wants buried.','https://picsum.photos/seed/redwood/600/900','R','COMING_SOON','Cold Case: Redwood','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (9,'A burnt-out chef restarts with a food truck and stubborn team.','https://picsum.photos/seed/chefs/600/900','PG-13','COMING_SOON','Chef’s Table: Fire & Stone','https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (10,'A runner joins an underground rooftop race to save a friend.','https://picsum.photos/seed/skyline/600/900','PG-13','COMING_SOON','Skyline Sprint','https://www.youtube.com/embed/dQw4w9WgXcQ');

INSERT INTO movie_genres VALUES 
  (1,'Action'),(1,'Thriller'),(2,'Drama'),(2,'Romance'),(3,'Sci-Fi'),(3,'Action'),
  (4,'Mystery'),(4,'Comedy'),(5,'Adventure'),(5,'Family'),(6,'Fantasy'),(6,'Adventure'),
  (7,'Drama'),(7,'Music'),(8,'Thriller'),(8,'Mystery'),(9,'Comedy'),(9,'Drama'),
  (10,'Action'),(10,'Sport');

INSERT INTO movie_show_dates VALUES 
  (1,'2026-02-26'),(1,'2026-02-27'),(2,'2026-02-25'),(2,'2026-02-26'),
  (3,'2026-02-27'),(3,'2026-02-28'),(4,'2026-02-24'),(4,'2026-02-25'),
  (5,'2026-02-26'),(6,'2026-03-05'),(6,'2026-03-06'),(7,'2026-03-01'),
  (8,'2026-03-02'),(8,'2026-03-03'),(9,'2026-03-04'),(10,'2026-03-07');

INSERT INTO movie_showtimes VALUES
  (1,'2:00 PM'),(1,'5:00 PM'),(1,'8:00 PM'),(2,'2:00 PM'),(2,'5:00 PM'),(2,'8:00 PM'),
  (3,'2:00 PM'),(3,'5:00 PM'),(3,'8:00 PM'),(4,'2:00 PM'),(4,'5:00 PM'),(4,'8:00 PM'),
  (5,'2:00 PM'),(5,'5:00 PM'),(5,'8:00 PM'),(6,'2:00 PM'),(6,'5:00 PM'),(6,'8:00 PM'),
  (7,'2:00 PM'),(7,'5:00 PM'),(7,'8:00 PM'),(8,'2:00 PM'),(8,'5:00 PM'),(8,'8:00 PM'),
  (9,'2:00 PM'),(9,'5:00 PM'),(9,'8:00 PM'),(10,'2:00 PM'),(10,'5:00 PM'),(10,'8:00 PM');

INSERT INTO payment_cards VALUES
  (1,1,_binary 'W���,�Eگ\�W�\�3�3\��\���V��հ�\�','Alice Admin','12/26','2026-03-29 23:42:12'),
  (2,2,_binary '\�gUFW\�t\"\�\�\��S\�3\��\���V��հ�\�','Bob User','01/25','2026-03-29 23:42:12'),
  (3,2,_binary '�\�>\�آ@�K�ѕ�3\��\���V��հ�\�','Bob User','02/25','2026-03-29 23:42:12'),
  (4,2,_binary 'n�uݷM�����Xq$�3\��\���V��հ�\�','Bob User','03/25','2026-03-29 23:42:12');

INSERT INTO email_verifications VALUES 
  (1,3,'VERIFICATIONTOKEN123','2026-03-30 19:39:00','2026-03-29 23:39:00');

INSERT INTO password_resets VALUES (); -- If empty, can be skipped

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;