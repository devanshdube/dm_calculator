-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2025 at 08:27 AM
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
-- Database: `dm_calculator`
--

-- --------------------------------------------------------

--
-- Table structure for table `ads_campaign_details`
--

CREATE TABLE `ads_campaign_details` (
  `id` int(11) NOT NULL,
  `txn_id` varchar(100) DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `amount` varchar(100) DEFAULT NULL,
  `percent` varchar(100) DEFAULT NULL,
  `charge` varchar(100) DEFAULT NULL,
  `total` varchar(100) DEFAULT NULL,
  `employee` varchar(250) DEFAULT NULL,
  `created_at` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ads_campaign_details`
--

INSERT INTO `ads_campaign_details` (`id`, `txn_id`, `client_id`, `unique_id`, `category`, `amount`, `percent`, `charge`, `total`, `employee`, `created_at`) VALUES
(43, '1754052607054', 17, '1754052630262-ftqkkut5g', 'Google Ad', '5000', '45', '2250', '7250', 'Abhinav Pandey', '2025-08-01 18:20:30'),
(44, '1754052607054', 17, '1754052630262-mxnjiuaps', 'Meta Ad', '4000', '35', '1400', '5400', 'Abhinav Pandey', '2025-08-01 18:20:30'),
(45, '1754292579013', 18, '1754292886707-34pdiqsz0', 'Google Ad', '5000', '45', '2250', '7250', 'Dev BD', '2025-08-04 13:04:46'),
(46, '1754292579013', 18, '1754292886707-6lqzcho2c', 'Meta Ad', '4000', '35', '1400', '5400', 'Dev BD', '2025-08-04 13:04:46'),
(48, '1754388268452', 20, '1754388456499-g814t70qo', 'Meta Ad', '30000', '25', '7500', '37500', 'Abhinav Pandey', '2025-08-05 15:37:37'),
(49, '1754396496221', 25, '1754397368302-1j2ku0lij', 'Meta Ad', '30000', '25', '7500', '37500', 'Mohammad Mazhar', '2025-08-05 18:06:09');

-- --------------------------------------------------------

--
-- Table structure for table `calculator_transactions`
--

CREATE TABLE `calculator_transactions` (
  `id` int(11) NOT NULL,
  `txn_id` varchar(100) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `editing_type_name` varchar(255) DEFAULT NULL,
  `editing_type_amount` varchar(100) DEFAULT NULL,
  `quantity` varchar(100) DEFAULT NULL,
  `include_content_posting` varchar(50) DEFAULT NULL,
  `include_thumbnail_creation` varchar(50) DEFAULT NULL,
  `total_amount` varchar(100) DEFAULT NULL,
  `employee` varchar(250) DEFAULT NULL,
  `plan_name` varchar(255) DEFAULT 'Customise',
  `created_at` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calculator_transactions`
--

INSERT INTO `calculator_transactions` (`id`, `txn_id`, `client_id`, `service_name`, `category_name`, `editing_type_name`, `editing_type_amount`, `quantity`, `include_content_posting`, `include_thumbnail_creation`, `total_amount`, `employee`, `plan_name`, `created_at`) VALUES
(143, '1754142753273', 17, 'Video Services', 'Reels', 'Basic Editing', '1000', '2', '200', '300', '2500', 'Abhinav Pandey', 'Customise', '2025-08-02 19:22:47'),
(144, '1754142753273', 17, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '3', '200', '0', '1700', 'Abhinav Pandey', 'Customise', '2025-08-02 19:23:04'),
(145, '1754142753273', 17, 'Video Services', 'Reels', 'Standard Editing', '1500', '1', '200', '300', '2000', 'Abhinav Pandey', 'Customise', '2025-08-02 19:23:23'),
(148, '1754292353534', 18, 'Video Shoot', 'Camera Shoot', '15 min - 1 Hr', '2000', '1', '200', '0', '2200', 'Dev BD', 'Customise', '2025-08-04 12:56:04'),
(149, '1754292579013', 18, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '1000', '1', '0', '0', '1000', 'Dev BD', 'Customise', '2025-08-04 12:59:48'),
(152, '1754385579736', 18, 'Video Services', 'Reels', 'Standard Editing', '1500', '2', '0', '250', '3250', 'Abhinav Pandey', 'Customise', '2025-08-05 14:50:32'),
(154, '1754386148492', 18, 'Video Services', 'Reels', 'Basic Editing', '1000', '2', '0', '250', '2500', 'Abhinav Pandey', 'Customise', '2025-08-05 15:08:29'),
(162, '1754388268452', 20, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '8', '300', '0', '6400', 'Abhinav Pandey', 'Customise', '2025-08-05 15:34:57'),
(163, '1754388268452', 20, 'Video Services', 'Reels', 'Standard Editing', '1500', '4', '300', '250', '8200', 'Abhinav Pandey', 'Customise', '2025-08-05 15:35:15'),
(165, '1754388268452', 20, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '2', '0', '0', '1700', 'Abhinav Pandey', 'Customise', '2025-08-05 15:36:01'),
(166, '1754388268452', 20, 'Graphics Design', 'Festival Post', 'Complimenatary', '0', '2', '0', '0', '0', 'Abhinav Pandey', 'Customise', '2025-08-05 15:36:33'),
(167, '1754388268452', 20, 'SEO', 'Intended for Lead Generation', '1 Key word/On-Page Optimization/Off-Page Optimization/Keyword Research', '1200', '5', '0', '0', '6000', 'Abhinav Pandey', 'Customise', '2025-08-05 15:36:50'),
(168, '1754388268452', 20, 'GMB', 'LOCAL SEO', '1 Keyword', '1200', '5', '0', '0', '6000', 'Abhinav Pandey', 'Customise', '2025-08-05 15:37:20'),
(170, '1754396208875', 25, 'Video Services', 'Premium Video', 'Basic Editing', '1500', '2', '0', '250', '3500', 'Abhinav Pandey', 'Customise', '2025-08-05 17:49:32'),
(171, '1754396496221', 25, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '12', '300', '0', '9600', 'Mohammad Mazhar', 'Customise', '2025-08-05 17:52:43'),
(172, '1754396496221', 25, 'Video Services', 'Reels', 'Standard Editing', '1500', '6', '300', '250', '12300', 'Mohammad Mazhar', 'Customise', '2025-08-05 17:53:05'),
(173, '1754396496221', 25, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '4', '0', '0', '3400', 'Mohammad Mazhar', 'Customise', '2025-08-05 17:53:34'),
(174, '1754396496221', 25, 'Video Services', 'Youtube Video', 'Standard Editing', '3000', '3', '300', '250', '10650', 'Mohammad Mazhar', 'Customise', '2025-08-05 18:02:42'),
(175, '1754396496221', 25, 'Graphics Design', 'Festival Post', 'Complimenatary', '0', '2', '0', '0', '0', 'Mohammad Mazhar', 'Customise', '2025-08-05 18:04:17'),
(176, '1754396496221', 25, 'Video Services', 'Reels', 'Complementary', '0', '1', '0', '0', '0', 'Mohammad Mazhar', 'Customise', '2025-08-05 18:05:09'),
(182, '1755081311265', 25, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Customise', '2025-08-13 16:05:30'),
(183, '1755081311265', 25, 'Video Services', 'Premium Video', 'Standard Editing', '2500', '1', '300', '250', '3050', 'Abhinav Pandey', 'Customise', '2025-08-13 16:05:43'),
(184, '1755341329476', 26, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Customise', '2025-08-16 16:43:44'),
(185, '1755341329476', 26, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Customise', '2025-08-16 16:43:44'),
(186, '1755341329476', 26, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Customise', '2025-08-16 16:43:44'),
(187, '1755345339127', 26, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '8', '300', '0', '6400', 'Abhinav Pandey', 'Customise', '2025-08-16 17:26:17'),
(188, '1755345339127', 26, 'Video Services', 'Reels', 'Standard Editing', '1500', '4', '300', '250', '8200', 'Abhinav Pandey', 'Customise', '2025-08-16 17:26:17'),
(189, '1755345339127', 26, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '2', '0', '0', '1700', 'Abhinav Pandey', 'Customise', '2025-08-16 17:26:17'),
(190, '1755345339127', 26, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basicss', '2025-08-16 17:47:18'),
(191, '1755345339127', 26, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basicss', '2025-08-16 17:47:18'),
(192, '1755345339127', 26, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basicss', '2025-08-16 17:47:18'),
(193, '1755348913966', 26, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '12', '300', '0', '9600', 'Abhinav Pandey', 'Premium', '2025-08-16 18:25:15'),
(194, '1755348913966', 26, 'Video Services', 'Reels', 'Standard Editing', '1500', '6', '300', '250', '12300', 'Abhinav Pandey', 'Premium', '2025-08-16 18:25:15'),
(195, '1755348913966', 26, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '4', '0', '0', '3400', 'Abhinav Pandey', 'Premium', '2025-08-16 18:25:15'),
(196, '1755348913966', 26, 'Video Services', 'Youtube Video', 'Standard Editing', '3000', '1', '0', '0', '3000', 'Abhinav Pandey', 'Premium', '2025-08-16 18:25:15'),
(197, '1755348913966', 26, 'Social Media Posting', 'Posting', 'Youtube Video Posting', '200', '7', '0', '0', '1400', 'Abhinav Pandey', 'Premium', '2025-08-16 18:25:15'),
(198, '1755348913966', 26, 'Graphics Design', 'Thumbnail', 'Youtube Video Thumbnail', '300', '1', '0', '0', '300', 'Abhinav Pandey', 'Premium', '2025-08-16 18:25:15'),
(199, '1755354668518', 25, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '8', '300', '0', '6400', 'Abhinav Pandey', 'Standard', '2025-08-16 20:01:25'),
(200, '1755354668518', 25, 'Video Services', 'Reels', 'Standard Editing', '1500', '4', '300', '250', '8200', 'Abhinav Pandey', 'Standard', '2025-08-16 20:01:25'),
(201, '1755354668518', 25, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '2', '0', '0', '1700', 'Abhinav Pandey', 'Standard', '2025-08-16 20:01:25'),
(202, '1755355922445', 26, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '1', '300', '0', '800', 'Abhinav Pandey', 'Customise', '2025-08-16 20:22:55'),
(204, '1755513815492', 32, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 16:13:35'),
(205, '1755513815492', 32, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 16:13:35'),
(206, '1755513815492', 32, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 16:13:35'),
(207, '1755513940899', 49, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 16:15:40'),
(208, '1755513940899', 49, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 16:15:40'),
(209, '1755513940899', 49, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 16:15:40'),
(210, '1755514004331', 84, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 16:16:44'),
(211, '1755514004331', 84, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 16:16:44'),
(212, '1755514004331', 84, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 16:16:44'),
(213, '1755514032227', 22, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 16:17:12'),
(214, '1755514032227', 22, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 16:17:12'),
(215, '1755514032227', 22, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 16:17:12'),
(219, '1755514427471', 54, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 16:23:47'),
(220, '1755514427471', 54, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 16:23:47'),
(221, '1755514427471', 54, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 16:23:47'),
(222, '1755514657758', 38, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 16:27:37'),
(223, '1755514657758', 38, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 16:27:37'),
(224, '1755514657758', 38, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 16:27:37'),
(225, '1755517587337', NULL, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 17:16:27'),
(226, '1755517587337', NULL, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 17:16:27'),
(227, '1755517587337', NULL, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 17:16:27'),
(228, '1755517654800', 27, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 17:17:34'),
(229, '1755517654800', 28, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 17:17:34'),
(230, '1755517654800', 29, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 17:17:34'),
(231, '1755517751944', 30, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 17:19:11'),
(232, '1755517751944', 31, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 17:19:12'),
(233, '1755517751944', 32, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 17:19:12'),
(234, '1755520564396', 34, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 18:06:04'),
(235, '1755520564396', 34, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 18:06:04'),
(236, '1755520564396', 34, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 18:06:04'),
(237, '1755521457365', 35, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 18:20:57'),
(238, '1755521457365', 35, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 18:20:57'),
(239, '1755521457365', 35, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 18:20:57'),
(240, '1755521474876', 36, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '12', '300', '0', '9600', 'Abhinav Pandey', 'Premium', '2025-08-18 18:21:14'),
(241, '1755521474876', 36, 'Video Services', 'Reels', 'Standard Editing', '1500', '6', '300', '250', '12300', 'Abhinav Pandey', 'Premium', '2025-08-18 18:21:14'),
(242, '1755521474876', 36, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '4', '0', '0', '3400', 'Abhinav Pandey', 'Premium', '2025-08-18 18:21:14'),
(243, '1755521474876', 36, 'Video Services', 'Youtube Video', 'Standard Editing', '3000', '1', '0', '0', '3000', 'Abhinav Pandey', 'Premium', '2025-08-18 18:21:14'),
(244, '1755521474876', 36, 'Social Media Posting', 'Posting', 'Youtube Video Posting', '200', '7', '0', '0', '1400', 'Abhinav Pandey', 'Premium', '2025-08-18 18:21:14'),
(245, '1755521474876', 36, 'Graphics Design', 'Thumbnail', 'Youtube Video Thumbnail', '300', '1', '0', '0', '300', 'Abhinav Pandey', 'Premium', '2025-08-18 18:21:14'),
(246, '1755522577989', 37, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '8', '300', '0', '6400', 'Abhinav Pandey', 'Standard', '2025-08-18 18:39:37'),
(247, '1755522577989', 37, 'Video Services', 'Reels', 'Standard Editing', '1500', '4', '300', '250', '8200', 'Abhinav Pandey', 'Standard', '2025-08-18 18:39:37'),
(248, '1755522577989', 37, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '2', '0', '0', '1700', 'Abhinav Pandey', 'Standard', '2025-08-18 18:39:37'),
(249, '1755522935425', 37, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-18 18:53:44'),
(250, '1755522935425', 37, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-18 18:53:44'),
(251, '1755522935425', 37, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-18 18:53:44'),
(254, '1755672075255', 38, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', 'Basic', '2025-08-20 12:11:15'),
(255, '1755672075255', 38, 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', 'Basic', '2025-08-20 12:11:15'),
(256, '1755672075255', 38, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', 'Basic', '2025-08-20 12:11:15'),
(260, '1755673977114', 40, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '12', '300', '0', '9600', 'Abhinav Pandey', 'Premium', '2025-08-20 12:42:57'),
(261, '1755673977114', 40, 'Video Services', 'Reels', 'Standard Editing', '1500', '6', '300', '250', '12300', 'Abhinav Pandey', 'Premium', '2025-08-20 12:42:57'),
(262, '1755673977114', 40, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '4', '0', '0', '3400', 'Abhinav Pandey', 'Premium', '2025-08-20 12:42:57'),
(263, '1755673977114', 40, 'Video Services', 'Youtube Video', 'Standard Editing', '3000', '1', '0', '0', '3000', 'Abhinav Pandey', 'Premium', '2025-08-20 12:42:57'),
(264, '1755673977114', 40, 'Social Media Posting', 'Posting', 'Youtube Video Posting', '200', '7', '0', '0', '1400', 'Abhinav Pandey', 'Premium', '2025-08-20 12:42:57'),
(265, '1755673977114', 40, 'Graphics Design', 'Thumbnail', 'Youtube Video Thumbnail', '300', '1', '0', '0', '300', 'Abhinav Pandey', 'Premium', '2025-08-20 12:42:57'),
(269, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Customise', '2025-08-20 13:18:25'),
(283, '1755682112060', 41, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '8', '300', '0', '6400', 'Abhinav Pandey', 'Standard', '2025-08-20 14:58:33'),
(284, '1755682112060', 41, 'Video Services', 'Reels', 'Standard Editing', '1500', '4', '300', '250', '8200', 'Abhinav Pandey', 'Standard', '2025-08-20 14:58:33'),
(285, '1755682112060', 41, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '2', '0', '0', '1700', 'Abhinav Pandey', 'Standard', '2025-08-20 14:58:33'),
(286, '1755682690856', 39, 'Video Services', 'Premium Video', 'Basic Editing', '1500', '1', '0', '0', '1500', 'Abhinav Pandey', 'Customise', '2025-08-20 15:12:59'),
(287, '1755688485433', 41, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '1', '0', '0', '500', 'Abhinav Pandey', 'Customise', '2025-08-20 17:00:00'),
(288, '1755696044371', 40, 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '12', '300', '0', '9600', 'Abhinav Pandey', 'Premium', '2025-08-20 18:50:46'),
(289, '1755696044371', 40, 'Video Services', 'Reels', 'Standard Editing', '1500', '6', '300', '250', '12300', 'Abhinav Pandey', 'Premium', '2025-08-20 18:50:46'),
(290, '1755696044371', 40, 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '4', '0', '0', '3400', 'Abhinav Pandey', 'Premium', '2025-08-20 18:50:46'),
(291, '1755696044371', 40, 'Video Services', 'Youtube Video', 'Standard Editing', '3000', '1', '0', '0', '3000', 'Abhinav Pandey', 'Premium', '2025-08-20 18:50:46'),
(292, '1755696044371', 40, 'Social Media Posting', 'Posting', 'Youtube Video Posting', '200', '7', '0', '0', '1400', 'Abhinav Pandey', 'Premium', '2025-08-20 18:50:46'),
(293, '1755696044371', 40, 'Graphics Design', 'Thumbnail', 'Youtube Video Thumbnail', '300', '1', '0', '0', '300', 'Abhinav Pandey', 'Premium', '2025-08-20 18:50:46');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `service_id`, `category_name`, `created_at`) VALUES
(14, 12, 'Reels', '2025-06-13 14:40:18'),
(15, 12, 'Premium Video', '2025-06-13 14:47:47'),
(16, 12, 'Shorts', '2025-06-13 14:47:58'),
(17, 18, 'Static Graphics', '2025-06-13 14:56:24'),
(18, 14, 'Camera Shoot', '2025-06-13 14:58:01'),
(19, 14, 'Mobile Shoot', '2025-06-13 14:58:09'),
(28, 26, 'Intended for Lead Generation', '2025-07-02 13:15:00'),
(29, 27, 'LOCAL SEO', '2025-07-02 13:15:27'),
(30, 28, 'Website Maintenance', '2025-07-12 13:34:51'),
(31, 29, 'Posting', '2025-07-12 14:04:49'),
(32, 30, 'Organic page optimization', '2025-07-21 19:21:38'),
(33, 14, 'Drone Shoot', '2025-07-21 19:30:32'),
(34, 31, 'Create InstaGram Profile', '2025-07-27 16:05:09'),
(35, 32, 'Create Facebook page', '2025-07-27 16:06:32'),
(36, 33, 'Create Youtube Channel', '2025-07-27 16:08:07'),
(37, 34, 'Standard Video creation (Shoot, Editing and Four shorts)', '2025-07-27 16:11:18'),
(38, 18, 'Thumbnail', '2025-08-02 16:42:22'),
(40, 18, 'Festival Post', '2025-08-05 15:24:58'),
(41, 12, 'Youtube Video', '2025-08-05 18:01:11');

-- --------------------------------------------------------

--
-- Table structure for table `dm_calculator_ads`
--

CREATE TABLE `dm_calculator_ads` (
  `id` int(11) NOT NULL,
  `ads_category` varchar(250) DEFAULT NULL,
  `amt_range_start` varchar(100) DEFAULT NULL,
  `amt_range_end` varchar(100) DEFAULT NULL,
  `percentage` varchar(20) DEFAULT NULL,
  `created_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dm_calculator_ads`
--

INSERT INTO `dm_calculator_ads` (`id`, `ads_category`, `amt_range_start`, `amt_range_end`, `percentage`, `created_at`) VALUES
(4, 'Meta Ad', '1000', '10000', '35', '2025-06-13 15:45:11'),
(5, 'Meta Ad', '10001', '25000', '30', '2025-06-13 15:45:45'),
(6, 'Meta Ad', '25001', '50000', '25', '2025-06-13 15:46:17'),
(7, 'Meta Ad', '50001', 'Above', '20', '2025-06-13 15:50:31'),
(8, 'Google Ad', '1000', '10000', '45', '2025-06-13 15:51:33'),
(9, 'Google Ad', '10001', '25000', '40', '2025-06-13 15:53:09'),
(10, 'Google Ad', '25001', '50000', '35', '2025-06-13 15:53:49'),
(11, 'Google Ad', '50001', 'Above', '30', '2025-06-13 15:54:43');

-- --------------------------------------------------------

--
-- Table structure for table `dm_calculator_client_details`
--

CREATE TABLE `dm_calculator_client_details` (
  `id` int(11) NOT NULL,
  `client_name` varchar(250) DEFAULT NULL,
  `client_organization` varchar(250) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `dg_employee` varchar(250) DEFAULT NULL,
  `created_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dm_calculator_client_details`
--

INSERT INTO `dm_calculator_client_details` (`id`, `client_name`, `client_organization`, `email`, `phone`, `address`, `dg_employee`, `created_at`) VALUES
(17, 'google meta ', 'google ', 'google@gemail.com', '8585858585', 'USA ', 'Abhinav Pandey', '2025-08-01 16:05:31'),
(20, 'Chirag Gala', 'Gala Developers', 'Galadevelopers.jbp@gmail.com', '9244145552', 'Gala developers 3rd floor near maharashtra school,, Jabalpur, India, Madhya Pradesh', 'Abhinav Pandey', '2025-08-05 15:32:37'),
(25, 'Chirag Gala', 'Gala Developers', 'Galadevelopers.jbp@gmail.com', '9244145552', 'Gala developers 3rd floor near maharashtra school,, Jabalpur, India, Madhya Pradesh', 'Mohammad Mazhar', '2025-08-05 17:43:27'),
(26, 'T.N. Khan', 'Hotel Satya Ashoka', 'hotelsatyaashoka@hotmail.com', '9407561411', 'Pandit Ravishankar Shukla Stadium, Opposite, Wright Town Jabalpur, India 482002 Madhya Pradesh', 'Mohammad Mazhar', '2025-08-06 13:12:42'),
(33, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-18 17:29:29'),
(34, 'sd', 'test', 'umerqureshi786786@gmail.com', '985858223', 'fsd', 'Abhinav Pandey', '2025-08-18 18:06:04'),
(35, 's', 'Gala Developers', 'doaguruinfosystems@gmail.com', '7586868566', 'azs', 'Abhinav Pandey', '2025-08-18 18:20:57'),
(36, 's', 'Gala Developers', 'doaguruinfosystems@gmail.com', '7586868566', 'azs', 'Abhinav Pandey', '2025-08-18 18:21:14'),
(37, 'erererere', 'erer', NULL, '6260550661', '454', 'Abhinav Pandey', '2025-08-18 18:39:37'),
(39, 'test', 'test', 'doaguruinfosystems@gmail.com', '8585858582', ' vgfc', 'Abhinav Pandey', '2025-08-20 12:40:32'),
(40, 'test of client ', 'Gala Developers', 'umer@gmail.com', '985858225', 'j', 'Abhinav Pandey', '2025-08-20 12:42:57'),
(42, 'BD of Quotation', 'DOAguru', 'doaguruinfosystems@gmail.com', '7586868566', 'Jabalpur ', 'Dev BD', '2025-08-21 12:14:13'),
(43, 'sdsdsd', 'Gala Developers', 'umerqureshidoaguru@gmail.com', '8585858582', 'ty', 'Dev BD', '2025-08-21 12:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `dm_calculator_employees`
--

CREATE TABLE `dm_calculator_employees` (
  `id` int(11) NOT NULL,
  `employee_name` varchar(250) DEFAULT NULL,
  `employee_role` varchar(200) DEFAULT NULL,
  `employee_email` varchar(100) DEFAULT NULL,
  `employee_password` varchar(250) DEFAULT NULL,
  `created_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dm_calculator_employees`
--

INSERT INTO `dm_calculator_employees` (`id`, `employee_name`, `employee_role`, `employee_email`, `employee_password`, `created_at`) VALUES
(1, 'Abhinav Pandey', 'Owner', 'devdeveloper998@gmail.com', '$2b$10$o2FpLcZUHpfSOjWiP8t0nOHiFyx3ugLL8p9pAYJ/cL07S/AHA3k8.', '2025-06-06 17:26:10'),
(2, 'Dev BD', 'BD', 'deepanshu123.doaguru@gmail.com', '$2b$10$4XW3UqLUcd4vq8x1RlXuSuRRCLV6LNYq00UuPNyqhjsqbBZiGUdEu', '2025-06-07 16:07:04'),
(3, 'Umer Qureshi', 'BD', 'umer@gmail.com', '$2b$10$hooN1sL.6ZFhyYq7LCFM7eyoVyXE.QBpr1t/squ3sVxK5y2y7fUBm', '2025-06-27 14:59:59'),
(4, 'shiva12345', 'BD', 'm@le.com', '$2b$10$vYTDbD0gYklhB7EN3fLVr.Ad2lKUUarmHNZ3/zHVz2j55zJ6.1KYq', '2025-06-29 15:18:17'),
(5, 'Deepanshu Shukla', 'BD', 'deepanshushukla07@gmail.com', '$2b$10$fH1XSBsDD.Jwqcqm240lZuQ4QRy4jIwS.1FoXtMvAWy7mMc0q8csW', '2025-06-30 14:30:57'),
(6, 'Priyanshu', 'BD', 'test@gmail.com', '$2b$10$2DPiUzIZq/KEm2/Yuq/3dOrEuCuDu1TCT5DCxXNOymSsjIs1dXDWu', '2025-07-02 11:13:30'),
(7, 'Rechal Bashani', 'BD', 'rechalbashani@gmail.com', '$2b$10$68d/z68bKL5TEiB9BWIzPep46N80MWeYX0yKktxfA.JAuweCufeNq', '2025-07-05 12:17:21'),
(8, 'Vishakha Agrahari', 'BD', 'agraharivishakha285@gmail.com', '$2b$10$9BfjcLuiw5yVPFYGwYRI.efzU22J88dUjEklwrPPjy.ZDX03mRJXe', '2025-07-07 11:33:50'),
(9, 'Mohammad Mazhar', 'BD', 'md.mazharchisti@gmail.com', '$2b$10$4RPNY8hdol9z3/XCZhMmtuB0yDuTzOYbGbSfqDKxA2OMK9FlXLs3q', '2025-07-21 17:39:52');

-- --------------------------------------------------------

--
-- Table structure for table `editing_types`
--

CREATE TABLE `editing_types` (
  `editing_type_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `editing_type_name` varchar(100) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `created_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `editing_types`
--

INSERT INTO `editing_types` (`editing_type_id`, `service_id`, `category_id`, `editing_type_name`, `amount`, `created_at`) VALUES
(2, 12, 14, 'Standard Editing', '1500', '2025-06-13 14:49:18'),
(4, 12, 14, 'Advanced Editing', '4000', '2025-06-13 14:50:20'),
(5, 12, 15, 'Basic Editing', '1500', '2025-06-13 14:52:03'),
(6, 12, 15, 'Standard Editing', '2500', '2025-06-13 14:52:38'),
(8, 12, 16, 'Basic Editing', '500', '2025-06-13 14:53:47'),
(9, 12, 16, 'Standard Editing', '1000', '2025-06-13 14:54:04'),
(10, 12, 16, 'Advanced Editing', '3000', '2025-06-13 14:54:31'),
(12, 18, 17, 'Banner/Poster Design', '500', '2025-06-13 14:56:59'),
(13, 18, 17, 'Carousel', '700', '2025-06-13 14:57:15'),
(15, 14, 18, '15 min - 1 Hr', '2000', '2025-06-13 15:00:49'),
(23, 26, 28, '1 Key word/On-Page Optimization/Off-Page Optimization/Keyword Research', '1200', '2025-07-02 13:16:58'),
(24, 27, 29, '1 Keyword', '1200', '2025-07-02 13:18:24'),
(25, 28, 30, 'Maintenance', '1500', '2025-07-12 13:35:16'),
(27, 14, 19, 'Complementary', '0', '2025-07-21 17:46:33'),
(28, 14, 18, 'Complementary', '0', '2025-07-21 17:46:51'),
(29, 18, 17, 'Complementary', '0', '2025-07-21 17:47:31'),
(30, 12, 14, 'Complementary', '0', '2025-07-21 17:47:47'),
(31, 14, 33, 'Drone shoot (Non FPV)', '2000', '2025-07-21 19:33:20'),
(32, 27, 29, 'Local SEO and negative comment handling', '1000', '2025-07-21 19:36:06'),
(36, 31, 34, 'Create InstaGram Profile', '1000', '2025-07-27 16:05:38'),
(37, 32, 35, 'Create Facebook Page', '1000', '2025-07-27 16:06:48'),
(38, 33, 36, 'Create Youtube Channel', '1000', '2025-07-27 16:08:27'),
(39, 34, 37, 'Standard Video creation (Shoot, Editing and shorts)', '10000', '2025-07-27 16:13:24'),
(41, 18, 38, 'Thumbnail Creation', '250', '2025-08-05 14:49:24'),
(42, 29, 31, 'Content Posting', '300', '2025-08-05 15:17:49'),
(43, 14, 19, '15 min - 1 Hr', '850', '2025-08-05 15:20:11'),
(44, 18, 40, 'Complimenatary', '0', '2025-08-05 15:25:11'),
(45, 12, 41, 'Standard Editing', '3000', '2025-08-05 18:01:52'),
(46, 29, 31, 'Youtube Video Posting', '200', '2025-08-14 16:49:06'),
(47, 18, 38, 'Youtube Video Thumbnail', '300', '2025-08-14 16:50:26');

-- --------------------------------------------------------

--
-- Table structure for table `plans_notes`
--

CREATE TABLE `plans_notes` (
  `id` int(255) NOT NULL,
  `note_name` varchar(255) NOT NULL,
  `plan` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans_notes`
--

INSERT INTO `plans_notes` (`id`, `note_name`, `plan`, `created_at`) VALUES
(5, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', 'Basic', '2025-08-19 18:42:00'),
(6, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', 'Basic', '2025-08-19 18:42:12'),
(7, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', 'Basic', '2025-08-19 18:42:26'),
(8, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', 'Basic', '2025-08-19 18:42:47'),
(10, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', 'Standard', '2025-08-20 10:24:45'),
(11, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', 'Standard', '2025-08-20 10:24:57'),
(12, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', 'Standard', '2025-08-20 10:25:11'),
(13, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', 'Standard', '2025-08-20 10:25:26'),
(14, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', 'Premium', '2025-08-20 10:25:58'),
(15, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', 'Premium', '2025-08-20 10:26:11'),
(16, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', 'Premium', '2025-08-20 10:26:20'),
(17, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', 'Premium', '2025-08-20 10:26:31'),
(19, 'ret', 'Customise', '2025-08-20 14:22:35'),
(20, 'k', 'Customise', '2025-08-20 15:00:21');

-- --------------------------------------------------------

--
-- Table structure for table `plan_client_notes`
--

CREATE TABLE `plan_client_notes` (
  `id` int(255) NOT NULL,
  `client_id` int(255) NOT NULL,
  `txn_id` int(255) NOT NULL,
  `note_name` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_client_notes`
--

INSERT INTO `plan_client_notes` (`id`, `client_id`, `txn_id`, `note_name`, `created_at`) VALUES
(31, 40, 2147483647, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', '2025-08-20 18:50:46'),
(32, 40, 2147483647, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', '2025-08-20 18:50:46'),
(33, 40, 2147483647, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', '2025-08-20 18:50:46'),
(34, 40, 2147483647, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', '2025-08-20 18:50:46'),
(35, 43, 2147483647, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', '2025-08-21 12:27:54'),
(36, 43, 2147483647, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', '2025-08-21 12:27:54'),
(37, 43, 2147483647, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', '2025-08-21 12:27:54'),
(38, 43, 2147483647, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', '2025-08-21 12:27:54'),
(39, 43, 2147483647, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', '2025-08-21 13:04:19'),
(40, 43, 2147483647, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', '2025-08-21 13:04:19'),
(41, 43, 2147483647, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', '2025-08-21 13:04:19'),
(42, 43, 2147483647, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', '2025-08-21 13:04:19'),
(43, 43, 2147483647, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', '2025-08-21 13:15:43'),
(44, 43, 2147483647, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', '2025-08-21 13:15:43'),
(45, 43, 2147483647, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', '2025-08-21 13:15:43'),
(46, 43, 2147483647, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', '2025-08-21 13:15:43'),
(47, 43, 2147483647, 'Facebook, Instagram & Meta business suit creation charges will apply for basic plan users if the page is not created yet.', '2025-08-21 13:26:35'),
(48, 43, 2147483647, 'The client pays for the Meta ad budget, and ad service charges will apply only if the client wants to run the ad.', '2025-08-21 13:26:35'),
(49, 43, 2147483647, 'Minimum Meta ad budget of Rs 3,000 is required for running the ad & service amount is also paid by the client.', '2025-08-21 13:26:35'),
(50, 43, 2147483647, 'All amounts need to be paid in advance. Only the ad budget will be paid upon request of the client or immediately after the service is started.', '2025-08-21 13:26:35');

-- --------------------------------------------------------

--
-- Table structure for table `plan_data`
--

CREATE TABLE `plan_data` (
  `id` int(11) NOT NULL,
  `plan_id` int(255) NOT NULL,
  `plan_name` varchar(250) NOT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `editing_type_name` varchar(255) DEFAULT NULL,
  `editing_type_amount` varchar(100) DEFAULT NULL,
  `quantity` varchar(100) DEFAULT NULL,
  `include_content_posting` varchar(50) DEFAULT NULL,
  `include_thumbnail_creation` varchar(50) DEFAULT NULL,
  `total_amount` varchar(100) DEFAULT NULL,
  `employee` varchar(250) DEFAULT NULL,
  `created_at` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_data`
--

INSERT INTO `plan_data` (`id`, `plan_id`, `plan_name`, `service_name`, `category_name`, `editing_type_name`, `editing_type_amount`, `quantity`, `include_content_posting`, `include_thumbnail_creation`, `total_amount`, `employee`, `created_at`) VALUES
(182, 4, 'Basic', 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '5', '300', '0', '4000', 'Abhinav Pandey', '2025-08-14 13:21:21'),
(183, 4, 'Basic', 'Video Services', 'Reels', 'Standard Editing', '1500', '3', '300', '250', '6150', 'Abhinav Pandey', '2025-08-13 16:03:03'),
(184, 4, 'Basic', 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '1', '0', '0', '850', 'Abhinav Pandey', '2025-08-14 12:47:50'),
(189, 5, 'Standard', 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '8', '300', '0', '6400', 'Abhinav Pandey', '2025-08-14 16:40:26'),
(190, 5, 'Standard', 'Video Services', 'Reels', 'Standard Editing', '1500', '4', '300', '250', '8200', 'Abhinav Pandey', '2025-08-14 16:41:20'),
(191, 5, 'Standard', 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '2', '0', '0', '1700', 'Abhinav Pandey', '2025-08-14 16:41:43'),
(192, 6, 'Premium', 'Graphics Design', 'Static Graphics', 'Banner/Poster Design', '500', '12', '300', '0', '9600', 'Abhinav Pandey', '2025-08-14 16:42:47'),
(193, 6, 'Premium', 'Video Services', 'Reels', 'Standard Editing', '1500', '6', '300', '250', '12300', 'Abhinav Pandey', '2025-08-14 16:43:11'),
(194, 6, 'Premium', 'Video Shoot', 'Mobile Shoot', '15 min - 1 Hr', '850', '4', '0', '0', '3400', 'Abhinav Pandey', '2025-08-14 16:43:29'),
(195, 6, 'Premium', 'Video Services', 'Youtube Video', 'Standard Editing', '3000', '1', '0', '0', '3000', 'Abhinav Pandey', '2025-08-14 16:47:07'),
(196, 6, 'Premium', 'Social Media Posting', 'Posting', 'Youtube Video Posting', '200', '7', '0', '0', '1400', 'Abhinav Pandey', '2025-08-14 16:54:55'),
(197, 6, 'Premium', 'Graphics Design', 'Thumbnail', 'Youtube Video Thumbnail', '300', '1', '0', '0', '300', 'Abhinav Pandey', '2025-08-14 16:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `plan_details`
--

CREATE TABLE `plan_details` (
  `id` int(11) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `created_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_details`
--

INSERT INTO `plan_details` (`id`, `plan_name`, `created_at`) VALUES
(4, 'Basic', '2025-08-13 18:42:24'),
(5, 'Standard', '2025-08-14 12:08:14'),
(6, 'Premium', '2025-08-14 12:10:38');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `created_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `created_at`) VALUES
(12, 'Video Services', '2025-06-13 14:37:45'),
(14, 'Video Shoot', '2025-06-13 14:38:06'),
(18, 'Graphics Design', '2025-06-13 14:55:41'),
(26, 'SEO', '2025-07-02 13:14:05'),
(27, 'GMB', '2025-07-02 13:14:33'),
(28, 'Website Maintenance', '2025-07-12 13:33:25'),
(29, 'Social Media Posting', '2025-07-12 14:04:34'),
(30, 'Social Media Optimization', '2025-07-21 19:21:09'),
(31, 'Create InstaGram Profile', '2025-07-27 16:04:26'),
(32, 'Create Facebook page', '2025-07-27 16:06:19'),
(33, 'Create Youtube Channel', '2025-07-27 16:07:55'),
(34, 'Podcast Video creation', '2025-07-27 16:09:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ads_campaign_details`
--
ALTER TABLE `ads_campaign_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calculator_transactions`
--
ALTER TABLE `calculator_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `dm_calculator_ads`
--
ALTER TABLE `dm_calculator_ads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dm_calculator_client_details`
--
ALTER TABLE `dm_calculator_client_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dm_calculator_employees`
--
ALTER TABLE `dm_calculator_employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `editing_types`
--
ALTER TABLE `editing_types`
  ADD PRIMARY KEY (`editing_type_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `plans_notes`
--
ALTER TABLE `plans_notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plan_client_notes`
--
ALTER TABLE `plan_client_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `plan_data`
--
ALTER TABLE `plan_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plan_details`
--
ALTER TABLE `plan_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ads_campaign_details`
--
ALTER TABLE `ads_campaign_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `calculator_transactions`
--
ALTER TABLE `calculator_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=309;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `dm_calculator_ads`
--
ALTER TABLE `dm_calculator_ads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `dm_calculator_client_details`
--
ALTER TABLE `dm_calculator_client_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `dm_calculator_employees`
--
ALTER TABLE `dm_calculator_employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `editing_types`
--
ALTER TABLE `editing_types`
  MODIFY `editing_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `plans_notes`
--
ALTER TABLE `plans_notes`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `plan_client_notes`
--
ALTER TABLE `plan_client_notes`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `plan_data`
--
ALTER TABLE `plan_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT for table `plan_details`
--
ALTER TABLE `plan_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE;

--
-- Constraints for table `editing_types`
--
ALTER TABLE `editing_types`
  ADD CONSTRAINT `editing_types_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `editing_types_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `plan_client_notes`
--
ALTER TABLE `plan_client_notes`
  ADD CONSTRAINT `plan_client_notes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `dm_calculator_client_details` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
