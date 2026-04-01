-- -----------------------------
-- Database setup
-- -----------------------------
DROP DATABASE IF EXISTS cinema;
CREATE DATABASE cinema;
USE cinema;

-- -----------------------------
-- Lookup tables
-- -----------------------------
CREATE TABLE user_status (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO user_status (id, name) VALUES
(1,'active'),
(2,'inactive'),
(3,'suspended');

CREATE TABLE user_types (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO user_types (id, name) VALUES
(1,'admin'),
(2,'customer');

-- -----------------------------
-- Users
-- -----------------------------
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  user_type_id INT,
  status_id INT DEFAULT 2,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY user_type_id (user_type_id),
  KEY status_id (status_id),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (user_type_id) REFERENCES user_types (id),
  CONSTRAINT users_ibfk_2 FOREIGN KEY (status_id) REFERENCES user_status (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (email, password_hash, first_name, last_name, user_type_id, status_id) VALUES
('admin1@test.com','hashed_password1','Alice','Admin',1,1),
('user1@test.com','hashed_password2','Bob','User',2,1),
('user2@test.com','hashed_password3','Charlie','User',2,2);

-- -----------------------------
-- Addresses
-- -----------------------------
CREATE TABLE addresses (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  PRIMARY KEY (id),
  UNIQUE KEY user_id (user_id),
  CONSTRAINT addresses_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO addresses (user_id, street, city, state, zip_code) VALUES
(1,'123 Admin St','AdminCity','AC','11111'),
(2,'456 User Ln','UserCity','UC','22222');

-- -----------------------------
-- Movies
-- -----------------------------
CREATE TABLE movie (
  id BIGINT NOT NULL AUTO_INCREMENT,
  description VARCHAR(2000),
  poster_url VARCHAR(255),
  rating VARCHAR(255),
  status ENUM('COMING_SOON','CURRENTLY_RUNNING'),
  title VARCHAR(255),
  trailer_url VARCHAR(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO movie (description, poster_url, rating, status, title, trailer_url) VALUES
('A high-tech crew pulls one last job in a city that never sleeps.','https://picsum.photos/seed/neonheist/600/900','PG-13','CURRENTLY_RUNNING','Neon Heist','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('Two strangers exchange messages through a moon relay.','https://picsum.photos/seed/lunarletters/600/900','PG','CURRENTLY_RUNNING','Lunar Letters','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('A rookie engineer uncovers the truth behind a citywide AI blackout.','https://picsum.photos/seed/circuitbreakers/600/900','PG-13','CURRENTLY_RUNNING','Circuit Breakers','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('A small-town rumor turns into a big-time whodunit.','https://picsum.photos/seed/peachstate/600/900','PG-13','CURRENTLY_RUNNING','Peach State Mysteries','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('Kids discover a greenhouse where plants grow to impossible sizes.','https://picsum.photos/seed/garden/600/900','PG','CURRENTLY_RUNNING','Garden of Giants','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('A mapmaker learns the world changes whenever the ink dries.','https://picsum.photos/seed/atlas/600/900','PG-13','COMING_SOON','Midnight Atlas','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('A singer faces the quiet moments after sudden fame.','https://picsum.photos/seed/encore/600/900','PG','COMING_SOON','After the Encore','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('A detective reopens a case the town wants buried.','https://picsum.photos/seed/redwood/600/900','R','COMING_SOON','Cold Case: Redwood','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('A burnt-out chef restarts with a food truck and stubborn team.','https://picsum.photos/seed/chefs/600/900','PG-13','COMING_SOON','Chef’s Table: Fire & Stone','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('A runner joins an underground rooftop race to save a friend.','https://picsum.photos/seed/skyline/600/900','PG-13','COMING_SOON','Skyline Sprint','https://www.youtube.com/embed/dQw4w9WgXcQ');

-- -----------------------------
-- Email verifications
-- -----------------------------
CREATE TABLE email_verifications (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT email_verifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO email_verifications (user_id, token, expires_at) VALUES
(3,'VERIFICATIONTOKEN123','2026-03-30 19:39:00');

-- -----------------------------
-- Favorites
-- -----------------------------
CREATE TABLE favorites (
  user_id INT NOT NULL,
  movie_id BIGINT NOT NULL,
  PRIMARY KEY (user_id,movie_id),
  KEY movie_id (movie_id),
  CONSTRAINT favorites_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT favorites_ibfk_2 FOREIGN KEY (movie_id) REFERENCES movie (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO favorites (user_id, movie_id) VALUES
(2,1),(2,2);

-- -----------------------------
-- Movie genres
-- -----------------------------
CREATE TABLE movie_genres (
  movie_id BIGINT NOT NULL,
  genres VARCHAR(255),
  KEY FK_genre_movie (movie_id),
  CONSTRAINT FK_genre_movie FOREIGN KEY (movie_id) REFERENCES movie (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO movie_genres (movie_id, genres) VALUES
(1,'Action'),(1,'Thriller'),(2,'Drama'),(2,'Romance'),(3,'Sci-Fi'),(3,'Action'),
(4,'Mystery'),(4,'Comedy'),(5,'Adventure'),(5,'Family'),(6,'Fantasy'),(6,'Adventure'),
(7,'Drama'),(7,'Music'),(8,'Thriller'),(8,'Mystery'),(9,'Comedy'),(9,'Drama'),
(10,'Action'),(10,'Sport');

-- -----------------------------
-- Movie show dates
-- -----------------------------
CREATE TABLE movie_show_dates (
  movie_id BIGINT NOT NULL,
  show_dates DATE,
  KEY FK_show_dates_movie (movie_id),
  CONSTRAINT FK_show_dates_movie FOREIGN KEY (movie_id) REFERENCES movie (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO movie_show_dates (movie_id, show_dates) VALUES
(1,'2026-02-26'),(1,'2026-02-27'),(2,'2026-02-25'),(2,'2026-02-26'),
(3,'2026-02-27'),(3,'2026-02-28'),(4,'2026-02-24'),(4,'2026-02-25'),
(5,'2026-02-26'),(6,'2026-03-05'),(6,'2026-03-06'),(7,'2026-03-01'),
(8,'2026-03-02'),(8,'2026-03-03'),(9,'2026-03-04'),(10,'2026-03-07');

-- -----------------------------
-- Movie showtimes
-- -----------------------------
CREATE TABLE movie_showtimes (
  movie_id BIGINT NOT NULL,
  showtimes VARCHAR(255),
  KEY FK_showtimes_movie (movie_id),
  CONSTRAINT FK_showtimes_movie FOREIGN KEY (movie_id) REFERENCES movie (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO movie_showtimes (movie_id, showtimes) VALUES
(1,'2:00 PM'),(1,'5:00 PM'),(1,'8:00 PM'),(2,'2:00 PM'),(2,'5:00 PM'),(2,'8:00 PM'),
(3,'2:00 PM'),(3,'5:00 PM'),(3,'8:00 PM'),(4,'2:00 PM'),(4,'5:00 PM'),(4,'8:00 PM'),
(5,'2:00 PM'),(5,'5:00 PM'),(5,'8:00 PM'),(6,'2:00 PM'),(6,'5:00 PM'),(6,'8:00 PM'),
(7,'2:00 PM'),(7,'5:00 PM'),(7,'8:00 PM'),(8,'2:00 PM'),(8,'5:00 PM'),(8,'8:00 PM'),
(9,'2:00 PM'),(9,'5:00 PM'),(9,'8:00 PM'),(10,'2:00 PM'),(10,'5:00 PM'),(10,'8:00 PM');

-- -----------------------------
-- Password resets
-- -----------------------------
CREATE TABLE password_resets (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  token VARCHAR(255),
  expires_at DATETIME,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT password_resets_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- No initial data for password_resets

-- -----------------------------
-- Payment cards
-- -----------------------------
CREATE TABLE payment_cards (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  card_number VARBINARY(255),
  card_holder_name VARCHAR(255),
  expiry_date VARCHAR(10),
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT payment_cards_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO payment_cards (user_id, card_number, card_holder_name, expiry_date) VALUES
(1,_binary 'dummy1','Alice Admin','12/26'),
(2,_binary 'dummy2','Bob User','01/25'),
(2,_binary 'dummy3','Bob User','02/25'),
(2,_binary 'dummy4','Bob User','03/25');