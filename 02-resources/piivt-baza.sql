-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.7-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for piivt_app
DROP DATABASE IF EXISTS `piivt_app`;
CREATE DATABASE IF NOT EXISTS `piivt_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `piivt_app`;

-- Dumping structure for table piivt_app.answer
DROP TABLE IF EXISTS `answer`;
CREATE TABLE IF NOT EXISTS `answer` (
  `answer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(10) unsigned NOT NULL,
  `answer_value` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `fk_answer_game_id` (`game_id`),
  CONSTRAINT `fk_answer_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.country
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
  `country_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `country_code` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`country_id`),
  UNIQUE KEY `uq_country_name` (`name`),
  UNIQUE KEY `uq_country_country_code` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.expression
DROP TABLE IF EXISTS `expression`;
CREATE TABLE IF NOT EXISTS `expression` (
  `expression_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`expression_id`),
  UNIQUE KEY `uq_expression_value` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.game
DROP TABLE IF EXISTS `game`;
CREATE TABLE IF NOT EXISTS `game` (
  `game_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`game_id`),
  UNIQUE KEY `uq_game_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.question
DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `question_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(10) unsigned NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`question_id`),
  UNIQUE KEY `uq_question_title` (`title`),
  KEY `fk_question_game_id` (`game_id`),
  CONSTRAINT `fk_question_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.question_answer
DROP TABLE IF EXISTS `question_answer`;
CREATE TABLE IF NOT EXISTS `question_answer` (
  `question_answer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(10) unsigned NOT NULL,
  `answer_id` int(10) unsigned NOT NULL,
  `is_correct` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`question_answer_id`) USING BTREE,
  UNIQUE KEY `uq_answer_question_answer_id_question_id` (`answer_id`,`question_id`),
  KEY `fk_answer_question_question_id` (`question_id`),
  KEY `fk_answer_question_answer_id` (`answer_id`),
  CONSTRAINT `fk_answer_question_answer_id` FOREIGN KEY (`answer_id`) REFERENCES `answer` (`answer_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_answer_question_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `activation_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_activation_code` (`activation_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.word
DROP TABLE IF EXISTS `word`;
CREATE TABLE IF NOT EXISTS `word` (
  `word_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`word_id`),
  UNIQUE KEY `uq_word_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for trigger piivt_app.bi_question
DROP TRIGGER IF EXISTS `bi_question`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `bi_question` BEFORE INSERT ON `question` FOR EACH ROW BEGIN
IF NEW.game_id NOT IN (3, 4) THEN
	SIGNAL SQLSTATE '50001' SET MESSAGE_TEXT = 'Allowed ids for column game_id are 3 and 4.';
END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger piivt_app.bu_question
DROP TRIGGER IF EXISTS `bu_question`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `bu_question` BEFORE UPDATE ON `question` FOR EACH ROW BEGIN
IF NEW.game_id NOT IN (3, 4) THEN
	SIGNAL SQLSTATE '50001' SET MESSAGE_TEXT = 'Allowed ids for column game_id are 3 and 4.';
END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
