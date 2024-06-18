-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2024 at 08:22 PM
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
-- Database: `gymnius_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `role` enum('admin','moderator','seller') NOT NULL,
  `fk_userid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `role`, `fk_userid`) VALUES
(1, 'admin', 8);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_imagepath` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `category_imagepath`) VALUES
(1, 'Weightlifting', 'backend/public/category_images/weightliftingCategory.jpg'),
(2, 'Cardio', 'backend/public/category_images/cardioCategory.jpg'),
(3, 'Yoga', 'backend/public/category_images/yogaCategory.jpg'),
(4, 'Gym Equipment', 'backend/public/category_images/lead-resistance-bands.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `fk_customer_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_status` enum('Awaiting Payment','Shipped','Canceled','Completed') NOT NULL,
  `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shipping_address` varchar(250) NOT NULL,
  `billing_address` varchar(250) NOT NULL,
  `payment_method` enum('credit_card','debit_card','paypal') NOT NULL,
  `shipping_cost` decimal(10,2) NOT NULL,
  `tracking_number` varchar(40) NOT NULL,
  `discount` varchar(30) NOT NULL DEFAULT '0',
  `invoice_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `fk_customer_id`, `total_price`, `order_status`, `order_date`, `shipping_address`, `billing_address`, `payment_method`, `shipping_cost`, `tracking_number`, `discount`, `invoice_number`) VALUES
(1, 1, 30.00, 'Shipped', '2024-06-11', 'the house', 'the house', 'credit_card', 2.99, '123456789', '', NULL),
(2, 1, 47.99, 'Completed', '2024-06-11', 'wien', 'wien', 'paypal', 3.00, '122333', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `fk_order_id` int(11) DEFAULT NULL,
  `fk_product_id` int(11) DEFAULT NULL,
  `quantity` int(8) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `fk_order_id`, `fk_product_id`, `quantity`, `subtotal`) VALUES
(1, 1, 1, 1, 30.00),
(2, 2, 2, 2, 40.00),
(3, 2, 3, 1, 7.99);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `product_description` text NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_weight` decimal(10,2) NOT NULL,
  `product_quantity` int(10) NOT NULL,
  `product_category` enum('weightlifting','cardio','accessories','supplements') NOT NULL,
  `product_imagepath` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `product_description`, `product_price`, `product_weight`, `product_quantity`, `product_category`, `product_imagepath`) VALUES
(1, 'Premium Dumbbells', 'High-quality dumbbells for your daily workout routines.', 30.00, 20.00, 7, 'weightlifting', 'backend/public/product_images/dumbells.webp'),
(2, 'Eco-Friendly Yoga Mat', 'Comfortable and sustainable yoga mat for all yoga enthusiasts', 20.00, 2.00, 18, 'cardio', 'backend/public/product_images/yogamat.jpg'),
(3, 'Resistance Bands Set', 'Versatile resistance bands to enhance your training sessions.', 7.99, 0.80, 40, 'accessories', 'backend/public/product_images/resistancebands.jpg'),
(4, 'Test Product2', 'test', 999.99, 1.00, 1, 'weightlifting', 'backend/public/product_images/Cat_August_2010-4.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `salutation` enum('Mr.','Mrs.') NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `zipcode` varchar(20) NOT NULL,
  `city` varchar(64) NOT NULL,
  `email` varchar(150) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(260) NOT NULL,
  `payment_method` enum('credit_card','debit_card','paypal') NOT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `salutation`, `firstname`, `lastname`, `address`, `zipcode`, `city`, `email`, `username`, `password`, `payment_method`, `status`) VALUES
(1, 'Mr.', '123', '123', '123', '123', '123', '12345@gmail.com', '123', '$2y$10$g3rq/8xzzqnYCIKub/fqgu/aEcwVWhpVuWFbK506MUU8VMz2csRqK', 'credit_card', 'active'),
(2, 'Mr.', 'tester', 'tester', 'Testerstraße 1', '1001', 'Wien', 'tester@email.com', 'tester123', '$2y$10$4eugjzUBHW8m7vy0KdxnjufG5Qa.GnQ/uYL9/jie7ejFIymNvrJH.', 'credit_card', 'active'),
(3, 'Mr.', 'hello', 'hello', 'Test 13', '1050', 'Wien', 'asdas@gmail.com', 'testd213', '$2y$10$DGTouo.wDnkkw48zXaAAPuWaEDST4//LhMPMGlYJNM6hTwksOaUEK', 'credit_card', 'active'),
(4, 'Mr.', 'firstname', 'lastname', '123 street', '2020', 'Vienna', '123123@gmail.com', '123123', '$2y$10$tkFv1sZXsOtK91d/LyGEs.2BDJYE2YnxPdecZGExdHuXvXKhMffaC', 'credit_card', 'active'),
(5, 'Mr.', 'tttt', 'ttt', 'ttt', 'tt', 'tt', 'tesr@test.com', 'qweqwe', '$2y$10$BsW3wsVscen41.w3YgxZ4OiWtRwcuZozcKzaJernZCDJUeka4Mp/i', 'credit_card', 'active'),
(6, 'Mr.', '111', '111', '111', '111', '111 town', '111@gmail.com', '111', '$2y$10$t.yPU4Kw1JmHCbZf155Uau7cXi.6bRHq5dIiJHEqe8qtmZJReXt4u', 'credit_card', 'active'),
(7, 'Mr.', '222', '222', '222', '222', '222', '222@gmail.com', '222', '$2y$10$CFTxjd4ScZPTk3DHq.ZkvO4GJ3Saj/lW2Aj5SHGBbL28UWeFpQ6Mm', 'paypal', 'active'),
(8, 'Mr.', 'Admin', 'Admin', 'Admin Street 20', '100', 'Administrator Town', 'admin@gmail.com', 'admin', '$2y$10$cCUsXHm7UYAzg2DrZiGase9OkgOGkwCAYXIZBEjL3VOD144TZfFKS', 'credit_card', 'active'),
(9, 'Mr.', '1', '1', '1', '1', '1', '1@gmail.com', '1', '$2y$10$b.jyKuYKhL9Z8ckotnY7feGRrcVkQssu02zmGnS7Ka9Bwt041Uf7u', 'credit_card', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userid` (`fk_userid`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`fk_userid`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
