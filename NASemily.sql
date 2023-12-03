-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: localhost    Database: emily
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Activities`
--

DROP TABLE IF EXISTS `Activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Activities` (
  `ActivityID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci,
  `basePoints` int DEFAULT NULL,
  `diligence` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ShowTimer` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Activities`
--

LOCK TABLES `Activities` WRITE;
/*!40000 ALTER TABLE `Activities` DISABLE KEYS */;
INSERT INTO `Activities` VALUES (1,'Get Up','早上起床',5,'1',0),(2,'Eat Breakfast','吃早餐',5,'1',1),(4,'Exercise','进行体育锻炼',15,'1',0),(5,'Sleep','按时睡觉',10,'1',0),(6,'Homework: Math','完成数学作业',15,'1',0),(7,'Homework: Literature','完成语文作业',15,'1',0),(8,'Homework: English','完成英语作业',15,'1',0),(9,'Housework','完成家务',10,'1',0),(10,'Reading','阅读书籍',15,'1',0),(13,'Drink: Junk beverage','喝乱七八杂',-20,'1',0),(14,'Drink: Juice','果汁',0,'1',0),(15,'Drink: Milk','牛奶',2,'1',0),(16,'Drink: Water','水',2,'1',0),(17,'Snacks','零食',-10,'1',0),(30,'Have Lunch','吃午饭',3,'1',1),(40,'Have Dinner','吃晚饭',5,'1',1),(50,'Study','自主学习时间',10,'1',0);
/*!40000 ALTER TABLE `Activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ActivityMedia`
--

DROP TABLE IF EXISTS `ActivityMedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActivityMedia` (
  `MediaID` int NOT NULL AUTO_INCREMENT,
  `ActivityID` int DEFAULT NULL,
  `FilePath` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FileType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UploadDate` date DEFAULT NULL,
  PRIMARY KEY (`MediaID`),
  KEY `ActivityID` (`ActivityID`),
  CONSTRAINT `activitymedia_ibfk_1` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActivityMedia`
--

LOCK TABLES `ActivityMedia` WRITE;
/*!40000 ALTER TABLE `ActivityMedia` DISABLE KEYS */;
INSERT INTO `ActivityMedia` VALUES (1,1,'uploads/7a815b04dd8975faa59a7bb06b46cb29','image/jpeg','2023-11-24'),(2,1,'uploads/file-1700833137359.png','image/png','2023-11-24'),(3,7,'uploads/file-1700833406597.JPG','image/jpeg','2023-11-24'),(4,4,'uploads/1700833746815-643710044.jpg','image/jpeg','2023-11-24'),(5,1,'uploads/1700833820223-qqq.jpg','image/jpeg','2023-11-24'),(6,2,'uploads/Bb.mp4-1700899252631','video/mp4','2023-11-25'),(7,2,'uploads/Cc.mp4-1700899838910','video/mp4','2023-11-25'),(8,2,'uploads/Gg-1700899925466-281936756.mp4','video/mp4','2023-11-25'),(9,5,'uploads/Mm-1700899995489.mp4','video/mp4','2023-11-25'),(10,4,'uploads/Kk-1700900199297.mp4','video/mp4','2023-11-25'),(11,1,'uploads/Ll-1700968862375.mp4','video/mp4','2023-11-26'),(12,2,'uploads/Nn-20231126.mp4','video/mp4','2023-11-26'),(13,1,'uploads/Cc.mp4','video/mp4','2023-11-27'),(14,NULL,'uploads/Pasted_Image_2023_11_28__15_06.png','image/png','2023-12-01'),(15,NULL,'uploads/Pasted_Image_2023_11_28__15_06.png','image/png','2023-12-01');
/*!40000 ALTER TABLE `ActivityMedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExchangeRecords`
--

DROP TABLE IF EXISTS `ExchangeRecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExchangeRecords` (
  `ExchangeID` int NOT NULL AUTO_INCREMENT,
  `TimeID` int DEFAULT NULL,
  `ExchangeType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Amount` int DEFAULT NULL,
  `ExchangeDate` date DEFAULT NULL,
  PRIMARY KEY (`ExchangeID`),
  KEY `TimeID` (`TimeID`),
  CONSTRAINT `exchangerecords_ibfk_1` FOREIGN KEY (`TimeID`) REFERENCES `TimeManagement` (`TimeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExchangeRecords`
--

LOCK TABLES `ExchangeRecords` WRITE;
/*!40000 ALTER TABLE `ExchangeRecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `ExchangeRecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomeworkAttachments`
--

DROP TABLE IF EXISTS `HomeworkAttachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomeworkAttachments` (
  `AttachmentID` int NOT NULL AUTO_INCREMENT,
  `HomeworkID` int NOT NULL,
  `FilePath` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FileType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UploadDate` datetime NOT NULL,
  PRIMARY KEY (`AttachmentID`),
  KEY `HomeworkID` (`HomeworkID`),
  CONSTRAINT `homeworkattachments_ibfk_1` FOREIGN KEY (`HomeworkID`) REFERENCES `Homeworks` (`HomeworkID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomeworkAttachments`
--

LOCK TABLES `HomeworkAttachments` WRITE;
/*!40000 ALTER TABLE `HomeworkAttachments` DISABLE KEYS */;
INSERT INTO `HomeworkAttachments` VALUES (1,1,'attachments/Nn.mp4','video/mp4','2023-11-27 19:14:16'),(2,1,'attachments/Vv.mp4','video/mp4','2023-11-27 19:19:36'),(3,2,'attachments/Oo.mp4','video/mp4','2023-11-27 20:06:48'),(4,2,'attachments/placeholder.png','image/png','2023-11-27 21:42:49'),(5,3,'attachments/wenjianjia.png','image/png','2023-11-27 21:43:23'),(6,3,'attachments/dushu1.png','image/png','2023-11-27 21:53:20'),(7,3,'attachments/icon-gongzuozongshijian.png','image/png','2023-11-27 21:54:16'),(8,3,'attachments/rili.png','image/png','2023-11-27 22:03:03');
/*!40000 ALTER TABLE `HomeworkAttachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Homeworks`
--

DROP TABLE IF EXISTS `Homeworks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Homeworks` (
  `HomeworkID` int NOT NULL AUTO_INCREMENT,
  `ItemID` int NOT NULL,
  `Subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci,
  `SubmissionDate` date NOT NULL,
  PRIMARY KEY (`HomeworkID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Homeworks`
--

LOCK TABLES `Homeworks` WRITE;
/*!40000 ALTER TABLE `Homeworks` DISABLE KEYS */;
INSERT INTO `Homeworks` VALUES (1,1,'语文','完成课本第10页的阅读练习。','2023-04-10'),(2,1,'数学','完成代数作业第5章的习题。','2023-04-10'),(3,1,'英语','准备下周的英语口语测试。','2023-04-11'),(4,1,'手工','制作一个小型木质桌面摆件。','2023-04-12'),(5,1,'课外','阅读《小王子》并写一篇读后感。','2023-04-13');
/*!40000 ALTER TABLE `Homeworks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PointExchanges`
--

DROP TABLE IF EXISTS `PointExchanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PointExchanges` (
  `ExchangeID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `ExchangeType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PointsUsed` int DEFAULT NULL,
  `ExchangedFor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ExchangeDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `SpecialPointsUsed` int DEFAULT '0',
  PRIMARY KEY (`ExchangeID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `pointexchanges_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PointExchanges`
--

LOCK TABLES `PointExchanges` WRITE;
/*!40000 ALTER TABLE `PointExchanges` DISABLE KEYS */;
INSERT INTO `PointExchanges` VALUES (1,1,'看电视',2,'2 分钟','2023-11-26 18:27:38',0),(2,1,'看电视',2,'2 分钟','2023-11-26 18:27:55',0),(3,1,'看电视',1,'1 分钟','2023-11-26 18:45:06',0),(4,1,'换现金',1,'1 现金','2023-11-26 18:53:26',0),(5,1,'看电视',2,'2 分钟','2023-11-26 20:22:09',0),(6,1,'玩电脑',23,'23 分钟','2023-11-26 20:22:18',0),(7,1,'换现金',20,'1 现金','2023-11-26 20:22:23',1),(8,1,'Daily Check',0,'1 Special Point','2023-11-26 00:00:00',0);
/*!40000 ALTER TABLE `PointExchanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TimeManagement`
--

DROP TABLE IF EXISTS `TimeManagement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TimeManagement` (
  `TimeID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `GeneralTimeTotal` int DEFAULT NULL,
  `ComputerTimeTotal` int DEFAULT NULL,
  `TVTimeTotal` int DEFAULT NULL,
  `MobileTimeTotal` int DEFAULT NULL,
  `DailyLimit` int DEFAULT NULL,
  `WeeklyLimit` int DEFAULT NULL,
  `MonthlyLimit` int DEFAULT NULL,
  PRIMARY KEY (`TimeID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `timemanagement_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TimeManagement`
--

LOCK TABLES `TimeManagement` WRITE;
/*!40000 ALTER TABLE `TimeManagement` DISABLE KEYS */;
/*!40000 ALTER TABLE `TimeManagement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserActivities`
--

DROP TABLE IF EXISTS `UserActivities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserActivities` (
  `UserActivityID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `ActivityID` int DEFAULT NULL,
  `CurrentActivityDate` date DEFAULT NULL,
  `PointsAwarded` int DEFAULT NULL,
  `CompletionDateTime` datetime DEFAULT NULL,
  `CompletionDateOnly` date DEFAULT NULL,
  `Duration` int DEFAULT '0',
  PRIMARY KEY (`UserActivityID`),
  UNIQUE KEY `unique_activity_per_day` (`UserID`,`ActivityID`,`CompletionDateOnly`),
  KEY `ActivityID` (`ActivityID`),
  CONSTRAINT `useractivities_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `useractivities_ibfk_2` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserActivities`
--

LOCK TABLES `UserActivities` WRITE;
/*!40000 ALTER TABLE `UserActivities` DISABLE KEYS */;
INSERT INTO `UserActivities` VALUES (32,1,1,'2023-11-30',NULL,NULL,NULL,12);
/*!40000 ALTER TABLE `UserActivities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `CurrentTime` timestamp NULL DEFAULT NULL,
  `DailyPoints` int DEFAULT NULL,
  `ProgressPoints` int DEFAULT NULL,
  `total_points` int DEFAULT '0',
  `special_points` int DEFAULT '0',
  `LastDailyCheck` date DEFAULT NULL,
  `diligence` float DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Emily',NULL,10,NULL,NULL,NULL,144,4,'2023-11-26',1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-03 20:15:26
