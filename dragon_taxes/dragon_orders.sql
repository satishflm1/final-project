-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dragon
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (39,1,14.94,'pending','2025-03-23 13:55:00'),(40,10,14.94,'pending','2025-03-23 13:55:08'),(41,1,14.94,'pending','2025-03-23 14:02:44'),(42,10,21.83,'pending','2025-03-23 14:02:53'),(43,10,9.19,'pending','2025-03-23 14:03:14'),(44,3,45.93,'pending','2025-03-23 14:03:33'),(45,1,14.94,'pending','2025-03-23 14:10:00'),(46,11,14.94,'pending','2025-03-23 14:10:11'),(47,1,14.94,'pending','2025-03-23 14:14:41'),(48,10,14.94,'pending','2025-03-23 14:15:00'),(49,10,4.59,'pending','2025-03-23 14:15:03'),(50,3,14.94,'pending','2025-03-23 14:17:44'),(51,3,14.94,'pending','2025-03-23 14:21:09'),(52,3,39.04,'pending','2025-03-23 14:24:59'),(53,3,14.94,'pending','2025-03-23 14:28:18'),(54,4,14.94,'pending','2025-03-23 14:31:38'),(55,4,6.89,'pending','2025-03-23 14:31:50'),(56,4,6.89,'pending','2025-03-23 14:32:08'),(57,10,29.85,'pending','2025-03-23 14:34:35'),(58,4,26.42,'pending','2025-03-23 14:36:10'),(59,4,4.59,'pending','2025-03-23 14:36:31'),(60,5,26.42,'pending','2025-03-23 14:38:28'),(61,5,4.59,'pending','2025-03-23 14:38:56'),(62,5,21.83,'pending','2025-03-23 14:41:57'),(63,10,14.94,'pending','2025-03-23 14:51:14'),(64,5,130.99,'pending','2025-03-23 14:54:51'),(65,10,14.94,'pending','2025-03-23 15:21:28');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-23 21:19:10
