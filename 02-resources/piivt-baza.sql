-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.7-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
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

-- Dumping structure for table piivt_app.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `password_hash` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.answer
DROP TABLE IF EXISTS `answer`;
CREATE TABLE IF NOT EXISTS `answer` (
  `answer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(10) unsigned NOT NULL,
  `answer_value` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `fk_answer_game_id` (`game_id`),
  CONSTRAINT `fk_answer_game_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.game
DROP TABLE IF EXISTS `game`;
CREATE TABLE IF NOT EXISTS `game` (
  `game_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`game_id`),
  UNIQUE KEY `uq_game_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.question
DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `question_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(10) unsigned NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `user_id` int(10) unsigned NOT NULL,
  `is_correct` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `incorrect_message_reason` text COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`question_id`),
  KEY `fk_question_game_id` (`game_id`),
  KEY `fk_question_user_user_id` (`user_id`),
  CONSTRAINT `fk_question_game_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_question_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.question_answer
DROP TABLE IF EXISTS `question_answer`;
CREATE TABLE IF NOT EXISTS `question_answer` (
  `question_answer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(10) unsigned NOT NULL,
  `answer_id` int(10) unsigned NOT NULL,
  `is_correct` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`question_answer_id`) USING BTREE,
  UNIQUE KEY `uq_question_answer_question_id_answer_id` (`answer_id`,`question_id`) USING BTREE,
  KEY `fk_question_answer_question_id` (`question_id`) USING BTREE,
  KEY `fk_question_answer_answer_id` (`answer_id`) USING BTREE,
  CONSTRAINT `fk_question_answer_answer_answer_id` FOREIGN KEY (`answer_id`) REFERENCES `answer` (`answer_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_question_answer_question_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table piivt_app.score
DROP TABLE IF EXISTS `score`;
CREATE TABLE IF NOT EXISTS `score` (
  `score_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `value` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`score_id`),
  KEY `fk_score_user_user_id` (`user_id`),
  CONSTRAINT `fk_score_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
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
  `password_reset_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_activation_code` (`activation_code`)
  UNIQUE KEY `uq_user_password_reset_code` (`password_reset_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSERT users
INSERT INTO `user` (`username`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`, `activation_code`, `password_reset_code`) VALUES ('heyboi', NULL, NULL, 0, '2022-07-10 13:51:54', NULL, NULL, NULL);
INSERT INTO `user` (`username`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`, `activation_code`, `password_reset_code`) VALUES ('heyboi-second', NULL, NULL, 0, '2022-07-10 13:57:05', NULL, NULL, NULL);
INSERT INTO `user` (`username`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`, `activation_code`, `password_reset_code`) VALUES ('new-user', 'milosjeknic1@gmail.com', '$2b$10$XJordA2hVWwFRfGLQm5USezia/69hgYf012wIbWauX37iqtYX3i.S', 1, '2022-08-01 12:22:03', '2022-08-02 12:23:57', NULL, NULL);
INSERT INTO `user` (`username`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`, `activation_code`, `password_reset_code`) VALUES ('anewuser', 'milosjeknic@hotmail.rs', '$2b$10$s4u.k5k0qvAftD6rDRBd8.DWg4woj2zYWBy8BvjbYKtCncWWMQYA.', 1, '2022-08-24 12:26:26', '2022-08-31 15:34:57', NULL, NULL);

-- INSERT administrators
INSERT INTO `administrator` (`username`, `password_hash`, `created_at`, `is_active`) VALUES ('administrator', '$2b$10$.ALhDIXQsTVTDIsb8MPjRuVMYn9AX7oXlOgvP8Ar1U5psc.HgeEx2', '2022-07-08 22:16:54', 1);

-- INSERT games
INSERT INTO `game` (`name`) VALUES ('Calculate the expression');
INSERT INTO `game` (`name`) VALUES ('Find the longest word');
INSERT INTO `game` (`name`) VALUES ('Guess the country flag');
INSERT INTO `game` (`name`) VALUES ('Guess the country name');

-- INSERT answers for countries and numbers
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ga (Gabon)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gb (United Kingdom)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gd (Grenada)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ge (Georgia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gh (Ghana)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gm (Gambia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gn (Guinea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gq (Equatorial Guinea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gr (Greece)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'fr (France)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'fm (Micronesia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'do (Dominican Republic)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'dz (Algeria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ec (Ecuador)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ee (Estonia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'eg (Egypt)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'er (Eritrea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'es (Spain)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'et (Ethiopia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'fi (Finland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'fj (Fiji)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gt (Guatemala)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gw (Guinea-Bissau)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'gy (Guyana)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'jm (Jamaica)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'jo (Jordan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'jp (Japan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ke (Kenya)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'kg (Kyrgyzstan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'kh (Cambodia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ki (Kiribati)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'km (Comoros)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'kn (Saint Kitts and Nevis)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'it (Italy)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'is (Iceland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'hr (Croatia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ht (Haiti)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'hu (Hungary)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'id (Indonesia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ie (Ireland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'il (Israel)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'in (India)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'iq (Iraq)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ir (Iran)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'kp (North Korea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'dm (Dominica)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ad (Andorra)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bd (Bangladesh)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'be (Belgium)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bf (Burkina Faso)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bg (Bulgaria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bh (Bahrain)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bi (Burundi)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bj (Benin)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bn (Brunei)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bo (Bolivia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bb (Barbados)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ba (Bosnia and Herzegovina)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'az (Azerbaijan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ae (United Arab Emirates)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'af (Afghanistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ag (Antigua and Barbuda)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'al (Albania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'am (Armenia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ao (Angola)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'at (Austria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ar (Argentina)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'au (Australia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'br (Brazil)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bs (Bahamas)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cn (China)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'co (Colombia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cr (Costa Rica)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cu (Cuba)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cv (Cape Verde)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cy (Cyprus)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cz (Czechia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'de (Germany)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'dj (Djibouti)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cm (Cameroon)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cl (Chile)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ci (Côte d\'Ivoire (Ivory Coast))');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bt (Bhutan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bw (Botswana)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'by (Belarus)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'bz (Belize)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ca (Canada)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cd (DR Congo)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cf (Central African Republic)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'cg (Republic of the Congo)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ch (Switzerland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'dk (Denmark)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'kr (South Korea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'qa (Qatar)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sn (Senegal)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'so (Somalia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sr (Suriname)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ss (South Sudan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'st (São Tomé and Príncipe)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sv (El Salvador)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sy (Syria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sz (Eswatini (Swaziland))');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'td (Chad)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tg (Togo)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sl (Sierra Leone)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sk (Slovakia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'si (Slovenia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ro (Romania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'rs (Serbia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ru (Russia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'rw (Rwanda)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sa (Saudi Arabia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sb (Solomon Islands)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sc (Seychelles)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sd (Sudan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'se (Sweden)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sg (Singapore)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'th (Thailand)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tj (Tajikistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tl (Timor-Leste)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'va (Vatican City (Holy See))');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'vc (Saint Vincent and the Grenadines)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 've (Venezuela)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'vn (Vietnam)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'vu (Vanuatu)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ws (Samoa)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ye (Yemen)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'za (South Africa)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'zm (Zambia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'zw (Zimbabwe)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'uz (Uzbekistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'uy (Uruguay)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'us (United States)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tm (Turkmenistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tn (Tunisia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'to (Tonga)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tr (Turkey)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tt (Trinidad and Tobago)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tv (Tuvalu)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tw (Taiwan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'tz (Tanzania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ua (Ukraine)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ug (Uganda)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'hn (Honduras)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'kw (Kuwait)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mc (Monaco)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'md (Moldova)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'me (Montenegro)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mg (Madagascar)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mh (Marshall Islands)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mk (North Macedonia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ml (Mali)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mm (Myanmar)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mn (Mongolia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mr (Mauritania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mt (Malta)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ma (Morocco)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ly (Libya)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'kz (Kazakhstan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'la (Laos)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'lb (Lebanon)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'lc (Saint Lucia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'li (Liechtenstein)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'lk (Sri Lanka)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'lr (Liberia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ls (Lesotho)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'lt (Lithuania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'lu (Luxembourg)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'lv (Latvia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mu (Mauritius)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mv (Maldives)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'nz (New Zealand)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'om (Oman)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'pa (Panama)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'pe (Peru)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'pg (Papua New Guinea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ph (Philippines)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'pk (Pakistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'pl (Poland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'pt (Portugal)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'pw (Palau)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'py (Paraguay)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'sm (San Marino)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'nr (Nauru)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'np (Nepal)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mw (Malawi)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mx (Mexico)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'my (Malaysia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'mz (Mozambique)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'na (Namibia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ne (Niger)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ng (Nigeria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'ni (Nicaragua)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'nl (Netherlands)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (2, 'no (Norway)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ge (Georgia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'vn (Vietnam)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'id (Indonesia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'kw (Kuwait)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'kz (Kazakhstan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'la (Laos)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'lb (Lebanon)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'lc (Saint Lucia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'li (Liechtenstein)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'lk (Sri Lanka)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'lr (Liberia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ls (Lesotho)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'lt (Lithuania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'lu (Luxembourg)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'lv (Latvia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ly (Libya)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ma (Morocco)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mc (Monaco)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'md (Moldova)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'kr (South Korea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'kp (North Korea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ie (Ireland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'il (Israel)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'in (India)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'iq (Iraq)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ir (Iran)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'is (Iceland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'it (Italy)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'jm (Jamaica)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'jo (Jordan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'jp (Japan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ke (Kenya)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'kg (Kyrgyzstan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'kh (Cambodia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ki (Kiribati)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'km (Comoros)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'kn (Saint Kitts and Nevis)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'me (Montenegro)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mg (Madagascar)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mh (Marshall Islands)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'np (Nepal)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'nr (Nauru)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'nz (New Zealand)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'om (Oman)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'pa (Panama)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'pe (Peru)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'pg (Papua New Guinea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ph (Philippines)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'pk (Pakistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'pl (Poland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'pt (Portugal)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'pw (Palau)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'py (Paraguay)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'qa (Qatar)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ro (Romania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'rs (Serbia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'no (Norway)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'nl (Netherlands)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mk (North Macedonia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ml (Mali)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mm (Myanmar)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mn (Mongolia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mr (Mauritania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mt (Malta)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mu (Mauritius)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mv (Maldives)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mw (Malawi)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mx (Mexico)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'my (Malaysia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'mz (Mozambique)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'na (Namibia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ne (Niger)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ng (Nigeria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ni (Nicaragua)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ru (Russia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ad (Andorra)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bj (Benin)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bn (Brunei)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bo (Bolivia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'br (Brazil)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bs (Bahamas)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bt (Bhutan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bw (Botswana)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'by (Belarus)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bz (Belize)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ca (Canada)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cd (DR Congo)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cf (Central African Republic)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cg (Republic of the Congo)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ch (Switzerland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ci (Côte d\'Ivoire (Ivory Coast))');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cl (Chile)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bi (Burundi)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bh (Bahrain)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ae (United Arab Emirates)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'af (Afghanistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ag (Antigua and Barbuda)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'al (Albania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'am (Armenia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ao (Angola)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ar (Argentina)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'at (Austria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'au (Australia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'az (Azerbaijan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ba (Bosnia and Herzegovina)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bb (Barbados)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bd (Bangladesh)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'be (Belgium)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bf (Burkina Faso)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'bg (Bulgaria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cm (Cameroon)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'co (Colombia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cr (Costa Rica)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'fm (Micronesia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'fr (France)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ga (Gabon)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gb (United Kingdom)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gd (Grenada)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gh (Ghana)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gm (Gambia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gn (Guinea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gq (Equatorial Guinea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gr (Greece)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gt (Guatemala)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gw (Guinea-Bissau)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'gy (Guyana)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'hn (Honduras)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'hr (Croatia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ht (Haiti)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'fj (Fiji)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'fi (Finland)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cu (Cuba)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cv (Cape Verde)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cy (Cyprus)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cz (Czechia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'de (Germany)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'dj (Djibouti)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'dk (Denmark)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'dm (Dominica)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'do (Dominican Republic)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'dz (Algeria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ec (Ecuador)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ee (Estonia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'eg (Egypt)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'er (Eritrea)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'es (Spain)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'et (Ethiopia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'hu (Hungary)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'cn (China)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ug (Uganda)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ua (Ukraine)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tz (Tanzania)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tw (Taiwan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tv (Tuvalu)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tt (Trinidad and Tobago)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tr (Turkey)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'to (Tonga)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tn (Tunisia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'us (United States)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'uy (Uruguay)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'uz (Uzbekistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'zw (Zimbabwe)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'zm (Zambia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'za (South Africa)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ye (Yemen)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ws (Samoa)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'vu (Vanuatu)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 've (Venezuela)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'vc (Saint Vincent and the Grenadines)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'va (Vatican City (Holy See))');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tm (Turkmenistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tl (Timor-Leste)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tj (Tajikistan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sl (Sierra Leone)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sk (Slovakia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'si (Slovenia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sg (Singapore)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'se (Sweden)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sd (Sudan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sc (Seychelles)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sb (Solomon Islands)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sa (Saudi Arabia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'rw (Rwanda)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sm (San Marino)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sn (Senegal)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'th (Thailand)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'tg (Togo)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'td (Chad)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sz (Eswatini (Swaziland))');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sy (Syria)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sv (El Salvador)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'st (São Tomé and Príncipe)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'ss (South Sudan)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'sr (Suriname)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (3, 'so (Somalia)');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '45');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '44');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '43');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '42');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '41');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '40');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '39');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '38');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '37');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '36');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '50');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '46');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '35');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '57');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '56');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '55');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '54');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '53');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '9');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '51');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '49');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '48');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '47');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '58');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '34');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '20');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '19');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '18');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '17');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '16');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '15');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '14');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '13');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '12');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '11');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '21');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '22');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '23');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '33');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '32');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '31');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '30');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '29');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '28');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '27');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '26');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '25');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '24');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '10');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '59');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '52');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '95');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '94');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '93');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '92');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '91');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '90');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '89');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '88');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '87');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '86');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '96');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '97');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '98');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '1');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '2');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '3');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '4');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '5');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '6');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '7');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '8');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '100');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '99');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '85');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '84');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '70');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '69');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '68');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '67');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '66');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '65');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '64');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '63');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '62');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '61');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '71');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '72');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '73');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '83');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '82');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '81');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '80');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '79');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '78');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '77');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '76');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '75');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '74');
INSERT INTO `answer` (`game_id`, `answer_value`) VALUES (4, '60');


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
