-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: smartschool
-- ------------------------------------------------------
-- Server version	5.1.46-community

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `newsvissi`
--

DROP TABLE IF EXISTS `newsvissi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newsvissi` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` int(3) unsigned NOT NULL DEFAULT '0' COMMENT 'categoria della news - corrisponde alla sezione del sito',
  `tit` varchar(200) NOT NULL DEFAULT '',
  `tags` varchar(200) DEFAULT '',
  `txt` varchar(4000) NOT NULL DEFAULT '' COMMENT 'testo della news',
  `img` varchar(80) NOT NULL DEFAULT '' COMMENT 'immagine della news',
  `href` varchar(200) NOT NULL DEFAULT '' COMMENT 'link della news',
  `ord` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'ordine (importanza) di apparizione',
  `tema` varchar(45) NOT NULL DEFAULT '',
  `ll` int(11) NOT NULL DEFAULT '0' COMMENT 'larghezza (0..12) 0=default',
  `op` varchar(45) NOT NULL DEFAULT '' COMMENT 'operatore che ha pubblicato',
  `dtpub` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'data di pubblicazione',
  `dtexp` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'data di scadenza',
  `ris` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=404 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsvissi`
--

LOCK TABLES `newsvissi` WRITE;
/*!40000 ALTER TABLE `newsvissi` DISABLE KEYS */;
INSERT INTO `newsvissi` VALUES (389,0,'img1','nature architecture decor','description','file/001_145x845.jpg','file/001_145x845.jpg',0,'',0,'De Biase Domenico','2017-05-06 07:58:18','2050-05-06 07:58:18',0),(390,0,'img2','nature architecture','description','file/002_680x8.jpg','file/002_680x8.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:12:06','2050-05-12 09:12:06',0),(391,0,'img3','decor architecture','description','file/003_355x750.jpg','file/003_355x750.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:27:16','2050-05-12 09:27:16',0),(392,0,'img4','nature architecture','description','file/004_12x890.jpg','file/004_12x890.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:28:06','2050-05-12 09:28:06',0),(393,0,'img5','nature','description','file/005_550x580.jpg','file/005_550x580.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:29:13','2050-05-12 09:29:13',0),(394,0,'img6','architecture decor','description','file/006_1230x9_3.jpg','file/006_1230x9_3.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:30:05','2050-05-12 09:30:05',0),(395,0,'img7','nature architecture','description','file/007_980x850.jpg','file/007_980x850.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:30:50','2050-05-12 09:30:50',0),(396,0,'img8','architecture decor','description','file/008_620x6.jpg','file/008_620x6.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:32:07','2050-05-12 09:32:07',0),(397,0,'img9','nature','description','file/009_485x1075.jpg','file/009_485x1075.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:32:44','2050-05-12 09:32:44',0),(398,0,'img10','nature','description','file/010_4x1050.jpg','file/010_4x1050.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:33:28','2050-05-12 09:33:28',0),(399,0,'img11','architecture','description','file/011_2x265.jpg','file/011_2x265.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:34:08','2050-05-12 09:34:08',0),(400,0,'img12','architecture','description','file/012_3x550.jpg','file/012_3x550.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:34:58','2050-05-12 09:34:58',0),(401,0,'img13','architecture decor','description','file/013_980x790jpg.jpg','file/013_980x790jpg.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:35:32','2050-05-12 09:35:32',0),(402,0,'img14','architecture','description','file/014_650x4.jpg','file/014_650x4.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:36:05','2050-05-12 09:36:05',0),(403,0,'img15','decor','description','file/015_410x350.jpg','file/015_410x350.jpg',0,'',0,'De Biase Domenico','2017-05-12 09:36:36','2050-05-12 09:36:36',0);
/*!40000 ALTER TABLE `newsvissi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabellevissi`
--

DROP TABLE IF EXISTS `tabellevissi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tabellevissi` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tip` varchar(45) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `cod` varchar(45) NOT NULL DEFAULT '',
  `des` varchar(200) NOT NULL DEFAULT '',
  `info` varchar(2000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1176 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabellevissi`
--

LOCK TABLES `tabellevissi` WRITE;
/*!40000 ALTER TABLE `tabellevissi` DISABLE KEYS */;
INSERT INTO `tabellevissi` VALUES (9,'UTENTE','0','User','||'),(10,'UTENTE','1','User with privileges','||'),(12,'UTENTE','10','Content writer','||'),(14,'UTENTE','30','Administrator','||'),(16,'NEWS','0','VISIBLE ITEMS','||'),(117,'NEWS','100','HIDDEN ITEMS','||'),(1175,'MENU','msg68','','Dear #name,#br#bryour credentials to get more from VISSI D\'ARTE web site are:#br#brlogin: #email#brpassword: #pwd#br#brSee you soon!#br#brThe staff||');
/*!40000 ALTER TABLE `tabellevissi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utentivissi`
--

DROP TABLE IF EXISTS `utentivissi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utentivissi` (
  `ID` int(10) NOT NULL AUTO_INCREMENT,
  `tagid` varchar(45) NOT NULL DEFAULT '',
  `login` varchar(80) NOT NULL DEFAULT '',
  `PWD` varchar(40) NOT NULL DEFAULT '',
  `TIPO` smallint(6) DEFAULT '0' COMMENT '0=semplice,10=redattore,20=sviluppatore,30=amministratore',
  `ACCESSI` mediumint(9) DEFAULT '0',
  `LASTACCESS` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `COGNOME` varchar(45) NOT NULL DEFAULT '',
  `NOME` varchar(45) NOT NULL DEFAULT '',
  `NOTE` varchar(2000) DEFAULT '' COMMENT 'abilitazione sezioni',
  `INFO` varchar(2000) NOT NULL DEFAULT '' COMMENT 'indirizzo;telefono;...',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Index_2` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=33816 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utentivissi`
--

LOCK TABLES `utentivissi` WRITE;
/*!40000 ALTER TABLE `utentivissi` DISABLE KEYS */;
INSERT INTO `utentivissi` VALUES (33807,'','Nico','N5b60eiGNNp1qB5juM1ucQ==',30,50,'2017-06-11 10:29:44','De Biase','Domenico','','||||A|'),(33808,'','vick','p8W4yoeU/dE5PXyArco+QA==',30,1,'2017-05-12 07:10:30','Martorelli','Victor','','||||A|'),(33809,'','tini','p8W4yoeU/dE5PXyArco+QA==',30,0,'2017-05-12 07:10:20','Martini','Matteo','','||||A|'),(33810,'','ventu','p8W4yoeU/dE5PXyArco+QA==',30,0,'2017-05-12 07:10:36','Venturini','Nicholas','','||||A|'),(33814,'','matteo','N5b60eiGNNp1qB5juM1ucQ==',30,28,'2017-05-12 07:14:16','Vitaloni','Matteo','','||||A|'),(33815,'','francesco','N5b60eiGNNp1qB5juM1ucQ==',30,26,'2017-05-12 07:11:22','Prezioso','Francesco','','||||A|');
/*!40000 ALTER TABLE `utentivissi` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-12  8:39:19
