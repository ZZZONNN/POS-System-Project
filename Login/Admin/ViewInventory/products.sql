-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2025 at 01:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phone_repair_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `compatibility` varchar(255) NOT NULL,
  `class` varchar(100) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `addon` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `compatibility`, `class`, `colors`, `addon`, `stock`) VALUES
(1, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'Regular', 'Black', '', 14),
(2, 'Huawei Y6s LCD Replacement', 699.00, 'Huawei', 'Huawei Y6s', 'Original', 'Black,White', 'Includes tools', 8),
(3, 'Vivo Y20 LCD Touchscreen', 669.00, 'Vivo', 'Vivo Y20', 'Original', 'Black', 'With adhesive', 10),
(4, 'Galaxy J8 LCD (AMOLED)', 3482.00, 'Samsung', 'Galaxy J8', 'Premium', 'Black', 'AMOLED display', 10),
(5, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'Regular', 'Black', '', 9995),
(6, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'Premium', 'Blue', '', 9994),
(7, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'Regular', 'Gold', '', 9998),
(8, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'TFT', 'Black', NULL, 9998),
(9, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'TFT', 'Blue', NULL, 9999),
(10, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'TFT', 'Gold', NULL, 9999),
(11, 'LCD Touch Screen Replacement', 2702.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'AMOLED', 'Black', NULL, 9999),
(12, 'LCD Touch Screen Replacement', 2702.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'AMOLED', 'Blue', NULL, 9999),
(13, 'Galaxy J7', 2702.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'AMOLED', 'Gold', NULL, 9999),
(14, 'LCD Touch Screen Replacement', 2702.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'AMOLED', 'Rose Gold', NULL, 9998),
(15, 'LCD Touch Screen Replacement', 1383.00, 'Samsung', 'A30 - A305 - SM-A305', 'TFT', 'Black', NULL, 9997),
(16, 'LCD Touch Screen Replacement', 1716.00, 'Samsung', 'A30 - A305 - SM-A305', 'AMOLED', 'Black', NULL, 9998),
(17, 'LCD Touch Screen Replacement', 2826.00, 'Samsung', 'A30 - A305 - SM-A305', 'TFT', 'Black', NULL, 9998),
(18, 'iPhone 11 Pro Case', 50.00, 'IPHONE', 'For 6 6S 7 8 PLUS X XS XR XSMAX Phone Case', 'Regular Class', 'Black', NULL, 9998),
(19, 'iPhone 11 Pro Case', 50.00, 'IPHONE', 'For 6 6S 7 8 PLUS X XS XR XSMAX Phone Case', 'Regular Class', 'Black', NULL, 9999),
(20, 'iPhone 11 Pro Max Case', 50.00, 'IPHONE', 'For 6 6S 7 8 PLUS X XS XR XSMAX Phone Case', 'Regular Class', 'Black', NULL, 9998),
(21, 'Micro USB Cable 2A Fast Charging Data Cable', 29.00, '', 'Universal', 'Regular Class', 'White', NULL, 9998),
(22, '30 Pin USB Data Sharing Cable', 49.00, '', 'Universal', 'Regular Class', 'White', NULL, 9999),
(23, 'Micro USB Cable 2A Fast Charging Data Cable', 39.00, '', 'Universal', 'Regular Class', 'White', NULL, 9998),
(24, 'Type C USB Standard Charging Cable', 29.00, '', 'Universal', 'Regular Class', 'White', NULL, 9998),
(25, 'Silicone Strap Hook Loop Cable Winder Headphone Cord Earphone Organizer Tie', 36.00, '', 'Universal', 'Regular Class', 'White', NULL, 9999),
(26, 'Silicone Strap Hook Loop Cable Winder Headphone Cord Earphone Organizer Tie', 37.00, '', 'Universal', 'Regular Class', 'Brown', NULL, 9999),
(27, 'Silicone Strap Hook Loop Cable Winder Headphone Cord Earphone Organizer Tie', 38.00, '', 'Universal', 'Regular Class', 'Pink', NULL, 9998),
(28, 'Tempered Oppo a31', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9999),
(29, 'Tempered Oppo  a33', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9998),
(30, 'Tempered Oppo a35', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9997),
(31, 'Tempered Oppo  a37', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9999),
(32, 'Tempered Oppo a59', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9999),
(33, 'Tempered Oppo F5', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9999),
(34, 'Tempered Oppo  A71', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9999),
(35, 'Tempered Oppo  A71  V7PLUS', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9998),
(36, 'Tempered Oppo  a59 f1s', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9999),
(37, 'Tempered Oppo  A71 V7', 59.00, 'Oppo', 'Oppo a31 a33 a35 a37 a59/ f1s F5 A71 V7 V7PLUS', 'Regular Class', NULL, NULL, 9999),
(38, 'For OPPO F3  LCD Touch Screen Replacement', 1685.00, 'Oppo', 'Oppo F3 - CPH1609, Oppo A77 (2017) - CPH1715', 'Original', 'Black', NULL, 9999),
(39, 'For OPPO  A77 2017  LCD Touch Screen Replacement', 2142.00, 'Oppo', 'Oppo F3 - CPH1609, Oppo A77 (2017) - CPH1715', 'Original', 'White', NULL, 9999),
(40, 'For OPPO A5s  LCD', 1681.00, 'Oppo', 'Oppo A7 - CPH1901/CPH1903/CPH1905/PBFM00/PBFT00, Oppo A7x - PBBM00/PBBT00, Oppo A12 - CPH2083/CPH2077, Oppo A5s - CPH1909/CPH1920/CPH1912, Oppo AX5s, ', 'Original', 'Black', NULL, 9999),
(41, 'For OPPO  A7  LCD', 1716.00, 'Oppo', 'Oppo A7 - CPH1901/CPH1903/CPH1905/PBFM00/PBFT00, Oppo A7x - PBBM00/PBBT00, Oppo A12 - CPH2083/CPH2077, Oppo A5s - CPH1909/CPH1920/CPH1912, Oppo AX5s, ', 'Original', 'Black', NULL, 9997),
(42, 'For OPPO Ax7 LCD', 597.00, 'Oppo', 'Oppo A7 - CPH1901/CPH1903/CPH1905/PBFM00/PBFT00, Oppo A7x - PBBM00/PBBT00, Oppo A12 - CPH2083/CPH2077, Oppo A5s - CPH1909/CPH1920/CPH1912, Oppo AX5s, ', 'Original', 'Black', NULL, 9998),
(43, 'For OPPO A12 LCD', 1681.00, 'Oppo', 'Oppo A7 - CPH1901/CPH1903/CPH1905/PBFM00/PBFT00, Oppo A7x - PBBM00/PBBT00, Oppo A12 - CPH2083/CPH2077, Oppo A5s - CPH1909/CPH1920/CPH1912, Oppo AX5s, ', 'Original', 'Black', NULL, 9999),
(44, 'For OPPO A57 2016  LCD Touch Screen Replacement', 999.00, 'Oppo', 'OPPO A57 2016 F3 Lite CPH1701', 'Original', 'Black', NULL, 9998),
(45, 'For OPPO F3 Lite LCD Touch Screen Replacement', 999.00, 'Oppo', 'OPPO A57 2016 F3 Lite CPH1701', 'Original', 'White', NULL, 9998),
(46, 'For OPPO A39 LCD Touch Screen Replacement', 922.00, 'Oppo', 'Oppo A37 A39', 'Original', 'Black', NULL, 9999),
(47, 'For OPPO A37 A39 LCD Touch Screen Replacement', 922.00, 'Oppo', 'Oppo A37 A39', 'Original', 'Black', NULL, 9998),
(48, 'For OPPO A39 LCD Touch Screen Replacement', 922.00, 'Oppo', 'Oppo A37 A39', 'Original', 'White', NULL, 9998),
(49, 'For OPPO A38 A39 LCD Touch Screen Replacement', 922.00, 'Oppo', 'Oppo A37 A38 A39', 'Original', 'White', NULL, 9999),
(50, 'For OPPO A8 LCD Touch Screen', 1144.00, 'Oppo', 'OPPO A8 A11 A11X A5 2020 A9 2020 A31 2020 REALME C3 5 5S 5i 6i Narzo 10', 'Original', 'Black', NULL, 9999),
(51, 'For OPPO A11 LCD Touch Screen', 1144.00, 'Oppo', 'OPPO A8 A11 A11X A5 2020 A9 2020 A31 2020 REALME C3 5 5S 5i 6i Narzo 10', 'Original', 'Black', NULL, 9999),
(52, 'For OPPO A11X  LCD Touch Screen', 1144.00, 'Oppo', 'OPPO A8 A11 A11X A5 2020 A9 2020 A31 2020 REALME C3 5 5S 5i 6i Narzo 10', 'Original', 'Black', NULL, 9999),
(53, 'For OPPO A5 LCD Touch Screen', 643.00, 'Oppo', 'OPPO A8 A11 A11X A5 2020 A9 2020 A31 2020 REALME C3 5 5S 5i 6i Narzo 10', 'Original', 'Black', NULL, 9999),
(54, 'For OPPO A5 2020 LCD Touch Screen', 643.00, 'Oppo', 'OPPO A8 A11 A11X A5 2020 A9 2020 A31 2020 REALME C3 5 5S 5i 6i Narzo 10', 'Original', 'Black', NULL, 9999),
(55, 'For REALME C3 LCD Touch Screen', 1144.00, 'Oppo', 'OPPO A8 A11 A11X A5 2020 A9 2020 A31 2020 REALME C3 5 5S 5i 6i Narzo 10', 'Original', 'Black', NULL, 9999),
(56, 'For OPPO  REALME 5 LCD Touch Screen', 1144.00, 'Oppo', 'OPPO A8 A11 A11X A5 2020 A9 2020 A31 2020 REALME C3 5 5S 5i 6i Narzo 10', 'Original', 'Black', NULL, 9999),
(57, 'FOR 5 HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'White', NULL, 9999),
(58, 'FOR 5S HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Black', NULL, 9999),
(59, 'FOR 6  HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Gold', NULL, 9999),
(60, 'FOR 6S HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Rose Gold', NULL, 9999),
(61, 'FOR 6S PLUS HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'White', NULL, 9999),
(62, 'FOR 5 HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Black', NULL, 9998),
(63, 'FOR 5S HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Gold', NULL, 9998),
(64, 'FOR 6  HOME BUTTON ASSEMBLY', 99.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Rose Gold', NULL, 9999),
(65, 'FOR 6S HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'White', NULL, 9999),
(66, 'FOR 6S PLUS HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Black', NULL, 9998),
(67, 'FOR 5 HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Gold', NULL, 9998),
(68, 'FOR 5S HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'White', NULL, 9998),
(69, 'FOR 6  HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Black', NULL, 9994),
(70, 'FOR 6S HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Gold', NULL, 9998),
(71, 'FOR 6S PLUS HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'White', NULL, 9998),
(72, 'FOR 5 HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Black', NULL, 9998),
(73, 'FOR 5S HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Gold', NULL, 9999),
(74, 'FOR 6  HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Rose Gold', NULL, 9999),
(75, 'FOR 6S HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'White', NULL, 9999),
(76, 'FOR 6S PLUS HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Black', NULL, 9999),
(77, 'FOR 5 HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Gold', NULL, 9999),
(78, 'FOR 5S HOME BUTTON ASSEMBLY', 129.00, 'iPhone', 'iPhone 5, 5S, S2E2016, 6, 6 PLUS, 6S, 6S PLUS', 'Original', 'Rose Gold', NULL, 9999),
(79, 'iPhone 4 LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'White', NULL, 9999),
(80, 'iPhone 4S LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'Black', NULL, 9999),
(81, 'iPhone 5 LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'Black', NULL, 9999),
(82, 'iPhone 5S LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'White', NULL, 9999),
(83, 'iPhone SE LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'Black', NULL, 9999),
(84, 'iPhone 6 LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'White', NULL, 9999),
(85, 'iPhone 7 LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'Black', NULL, 9999),
(86, 'iPhone 7 PLUS LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'White', NULL, 9999),
(87, 'iPhone 8 LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'Black', NULL, 9999),
(88, 'iPhone 8 PLUS LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'White', NULL, 9999),
(89, 'iPhone X LCD Screen Replacement', 856.00, 'iPhone', 'iPhone 4, 4S, 5, 5C, 5S, SE2016, 6, 6 PLUS, 6S, 6S PLUS, 7, 7 PLUS, 8/ SE 2020, 8 PLUS, PLUS X', 'Original', 'Black', NULL, 9999),
(90, 'Vivo Y01 LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(91, 'Vivo Y11S LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(92, 'Vivo Y20 LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(93, 'Vivo Y20G LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(94, 'Vivo Y20SG LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(95, 'Vivo Y20i LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(96, 'Vivo Y12S LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(97, 'Vivo Y12A LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054, VIVO Y01 - V2166, VIVO Y11S - V2028, VIVO Y12A - V2102, VIVO Y12S - V2026,V2033,V2042, VIVO Y12S 2021 - V2069,V2039,V2068, VI', 'Original', 'Black', 'With Frame', 9999),
(98, 'Vivo Y15S LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054', 'Original', 'Black', 'With Frame', 9999),
(99, 'Vivo Y15A LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052,V2054', 'Original', 'Black', 'With Frame', 9999),
(100, 'Vivo Y30g LCD Touchscreen Replacement', 669.00, 'VIVO', 'VIVO Y20 / Y20i / Y20s / Y20g / Y20t / Y20a / Y20sg / Y20 2021 V2029,V2038,V2027,V2032,V2043,V2048,V2037,V2065,V2129,V2052', 'Original', 'Black', 'With Frame', 9999),
(101, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'Regular', 'Gold', '', 9999),
(102, 'LCD Touch Screen Replacement', 1463.00, 'Samsung', 'J7 PRO - J7 2017 - J730 - J730G - J730G/DS - SM-J730', 'Regular', 'Gold', '', 9999);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
