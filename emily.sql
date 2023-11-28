-- MySQL dump 10.19  Distrib 10.3.29-MariaDB, for Linux (x64)
--
-- Host: localhost    Database: emily
-- ------------------------------------------------------
-- Server version	10.3.29-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Achievements`
--

DROP TABLE IF EXISTS `Achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Achievements` (
  `AchievementID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  PRIMARY KEY (`AchievementID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Achievements`
--

LOCK TABLES `Achievements` WRITE;
/*!40000 ALTER TABLE `Achievements` DISABLE KEYS */;
/*!40000 ALTER TABLE `Achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Achievements_Tasks`
--

DROP TABLE IF EXISTS `Achievements_Tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Achievements_Tasks` (
  `AchievementID` int(11) NOT NULL,
  `TaskID` int(11) NOT NULL,
  PRIMARY KEY (`AchievementID`,`TaskID`),
  KEY `TaskID` (`TaskID`),
  CONSTRAINT `Achievements_Tasks_ibfk_1` FOREIGN KEY (`AchievementID`) REFERENCES `Achievements` (`AchievementID`),
  CONSTRAINT `Achievements_Tasks_ibfk_2` FOREIGN KEY (`TaskID`) REFERENCES `Tasks` (`TaskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Achievements_Tasks`
--

LOCK TABLES `Achievements_Tasks` WRITE;
/*!40000 ALTER TABLE `Achievements_Tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `Achievements_Tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Activities`
--

DROP TABLE IF EXISTS `Activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Activities` (
  `ActivityID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `RewardPoints` int(11) DEFAULT NULL,
  PRIMARY KEY (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Activities`
--

LOCK TABLES `Activities` WRITE;
/*!40000 ALTER TABLE `Activities` DISABLE KEYS */;
INSERT INTO `Activities` VALUES (1,'Get Up','起床',10),(2,'Eat Breakfast','吃早餐',5),(3,'Study','学习',20),(4,'Exercise','锻炼',15),(5,'Sleep','睡觉',10),(6,'Get Up','早上起床',10),(7,'Eat Breakfast','吃早餐',5),(8,'Study','自主学习时间',20),(9,'Exercise','进行体育锻炼',15),(10,'Sleep','按时睡觉',10),(11,'Homework: Math','完成数学作业',15),(12,'Homework: Literature','完成语文作业',15),(13,'Homework: English','完成英语作业',15),(14,'Housework','完成家务',10),(15,'Reading','阅读书籍',15);
/*!40000 ALTER TABLE `Activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ActivityMedia`
--

DROP TABLE IF EXISTS `ActivityMedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ActivityMedia` (
  `MediaID` int(11) NOT NULL AUTO_INCREMENT,
  `ActivityID` int(11) DEFAULT NULL,
  `FilePath` varchar(255) DEFAULT NULL,
  `FileType` varchar(50) DEFAULT NULL,
  `UploadDate` date DEFAULT NULL,
  PRIMARY KEY (`MediaID`),
  KEY `ActivityID` (`ActivityID`),
  CONSTRAINT `ActivityMedia_ibfk_1` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActivityMedia`
--

LOCK TABLES `ActivityMedia` WRITE;
/*!40000 ALTER TABLE `ActivityMedia` DISABLE KEYS */;
INSERT INTO `ActivityMedia` VALUES (1,3,'uploads/640ef61372cf3e7d4fe211d3a2f1d400','image/png','2023-11-21');
/*!40000 ALTER TABLE `ActivityMedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExchangeRecords`
--

DROP TABLE IF EXISTS `ExchangeRecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ExchangeRecords` (
  `ExchangeID` int(11) NOT NULL AUTO_INCREMENT,
  `TimeID` int(11) DEFAULT NULL,
  `ExchangeType` varchar(255) DEFAULT NULL,
  `Amount` int(11) DEFAULT NULL,
  `ExchangeDate` date DEFAULT NULL,
  PRIMARY KEY (`ExchangeID`),
  KEY `TimeID` (`TimeID`),
  CONSTRAINT `ExchangeRecords_ibfk_1` FOREIGN KEY (`TimeID`) REFERENCES `TimeManagement` (`TimeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExchangeRecords`
--

LOCK TABLES `ExchangeRecords` WRITE;
/*!40000 ALTER TABLE `ExchangeRecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `ExchangeRecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GrowthRecords`
--

DROP TABLE IF EXISTS `GrowthRecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GrowthRecords` (
  `RecordID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) DEFAULT NULL,
  `TaskID` int(11) DEFAULT NULL,
  `CompletionDate` date DEFAULT NULL,
  PRIMARY KEY (`RecordID`),
  KEY `UserID` (`UserID`),
  KEY `TaskID` (`TaskID`),
  CONSTRAINT `GrowthRecords_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `GrowthRecords_ibfk_2` FOREIGN KEY (`TaskID`) REFERENCES `Tasks` (`TaskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GrowthRecords`
--

LOCK TABLES `GrowthRecords` WRITE;
/*!40000 ALTER TABLE `GrowthRecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `GrowthRecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Levels`
--

DROP TABLE IF EXISTS `Levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Levels` (
  `LevelID` int(11) NOT NULL AUTO_INCREMENT,
  `LevelName` varchar(255) DEFAULT NULL,
  `RequiredPoints` int(11) DEFAULT NULL,
  PRIMARY KEY (`LevelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Levels`
--

LOCK TABLES `Levels` WRITE;
/*!40000 ALTER TABLE `Levels` DISABLE KEYS */;
/*!40000 ALTER TABLE `Levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tasks`
--

DROP TABLE IF EXISTS `Tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tasks` (
  `TaskID` int(11) NOT NULL AUTO_INCREMENT,
  `Description` text DEFAULT NULL,
  `RewardPoints` int(11) DEFAULT NULL,
  PRIMARY KEY (`TaskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tasks`
--

LOCK TABLES `Tasks` WRITE;
/*!40000 ALTER TABLE `Tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TimeManagement`
--

DROP TABLE IF EXISTS `TimeManagement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TimeManagement` (
  `TimeID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) DEFAULT NULL,
  `GeneralTimeTotal` int(11) DEFAULT NULL,
  `ComputerTimeTotal` int(11) DEFAULT NULL,
  `TVTimeTotal` int(11) DEFAULT NULL,
  `MobileTimeTotal` int(11) DEFAULT NULL,
  `DailyLimit` int(11) DEFAULT NULL,
  `WeeklyLimit` int(11) DEFAULT NULL,
  `MonthlyLimit` int(11) DEFAULT NULL,
  PRIMARY KEY (`TimeID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `TimeManagement_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserActivities` (
  `UserActivityID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) DEFAULT NULL,
  `ActivityID` int(11) DEFAULT NULL,
  `CompletionDate` date DEFAULT NULL,
  `PointsAwarded` int(11) DEFAULT NULL,
  PRIMARY KEY (`UserActivityID`),
  KEY `UserID` (`UserID`),
  KEY `ActivityID` (`ActivityID`),
  CONSTRAINT `UserActivities_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `UserActivities_ibfk_2` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserActivities`
--

LOCK TABLES `UserActivities` WRITE;
/*!40000 ALTER TABLE `UserActivities` DISABLE KEYS */;
INSERT INTO `UserActivities` VALUES (2,1,3,'2023-11-20',20),(3,1,5,'2023-11-21',10);
/*!40000 ALTER TABLE `UserActivities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Avatar` varchar(255) DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `CurrentTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `DailyPoints` int(11) DEFAULT NULL,
  `ProgressPoints` int(11) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Emily',NULL,10,'2023-11-20 15:43:41',NULL,NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rewardSetting`
--

DROP TABLE IF EXISTS `rewardSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rewardSetting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `currentLevel` int(11) NOT NULL,
  `totalTime` int(11) NOT NULL,
  `addTime5Min` int(11) NOT NULL,
  `addTime10Min` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rewardSetting`
--

LOCK TABLES `rewardSetting` WRITE;
/*!40000 ALTER TABLE `rewardSetting` DISABLE KEYS */;
INSERT INTO `rewardSetting` VALUES (1,2,20,6,12);
/*!40000 ALTER TABLE `rewardSetting` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-24 20:46:12
