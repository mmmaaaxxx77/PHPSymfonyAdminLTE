-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Oct 10, 2016 at 12:02 AM
-- Server version: 5.6.28
-- PHP Version: 7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `test2`
--

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` char(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:guid)',
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
('744874a0-8d59-11e6-9131-2bf654bdba6b', 'ROLE_USER', NULL),
('f73d2a1c-8cba-11e6-9131-2bf654bdba6b', 'ROLE_ADMIN', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:guid)',
  `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `online` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `is_active`, `create_date`, `update_date`, `last_login`, `online`) VALUES
('3cdeac82-8d59-11e6-9131-2bf654bdba6b', 'test', '$2y$13$fcCJ/wRpGZBdIVjFhB6O0O845r1l8jaaFp5rslc3aYEBJNDWnyQkG', 'test@test.test', 1, '2016-10-08 21:15:06', '2016-10-08 21:15:06', '2016-10-08 22:08:50', 0),
('ce038648-8d71-11e6-9131-2bf654bdba6b', 't2', '$2y$13$iuwBwUl.vrSGE2iak8Xp2u2f4BzmMkbInyIJ/GqiD1JbotVMLtbn6', 't2@test.test', 1, '2016-10-09 00:10:58', '2016-10-09 00:10:58', NULL, 0),
('dc29b5a2-8cb9-11e6-9131-2bf654bdba6b', 'johnny', '$2y$13$d4Ca0bwhJVmDqHUuOwt7M.Qoah/YpS52Kdz8XkJwV8ILnGjs5UdVa', 'johnny@johnny.johnny', 1, '2016-10-08 02:14:14', '2016-10-08 02:14:14', '2016-10-09 20:49:14', 0),
('e1588630-8d71-11e6-9131-2bf654bdba6b', 't3', '$2y$13$UNjmNsEWRV8M4Wl0Jg2hjeDtHGMFBr9qvm7LLw.7QZTD70eAKtfOO', 't33@t.ttt', 1, '2016-10-09 00:11:31', '2016-10-09 00:11:31', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `user_id` char(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:guid)',
  `role_id` char(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:guid)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
('3cdeac82-8d59-11e6-9131-2bf654bdba6b', '744874a0-8d59-11e6-9131-2bf654bdba6b'),
('ce038648-8d71-11e6-9131-2bf654bdba6b', '744874a0-8d59-11e6-9131-2bf654bdba6b'),
('dc29b5a2-8cb9-11e6-9131-2bf654bdba6b', '744874a0-8d59-11e6-9131-2bf654bdba6b'),
('dc29b5a2-8cb9-11e6-9131-2bf654bdba6b', 'f73d2a1c-8cba-11e6-9131-2bf654bdba6b'),
('e1588630-8d71-11e6-9131-2bf654bdba6b', '744874a0-8d59-11e6-9131-2bf654bdba6b'),
('e1588630-8d71-11e6-9131-2bf654bdba6b', 'f73d2a1c-8cba-11e6-9131-2bf654bdba6b');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_B63E2EC75E237E06` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_1483A5E9F85E0677` (`username`),
  ADD UNIQUE KEY `UNIQ_1483A5E9E7927C74` (`email`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `IDX_2DE8C6A3A76ED395` (`user_id`),
  ADD KEY `IDX_2DE8C6A3D60322AC` (`role_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `FK_2DE8C6A3A76ED395` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_2DE8C6A3D60322AC` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
