/*
SQLyog Ultimate v11.11 (32 bit)
MySQL - 8.0.30 : Database - sena
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sena` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `sena`;

/*Table structure for table `actividades` */

DROP TABLE IF EXISTS `actividades`;

CREATE TABLE `actividades` (
  `id_actividad` int NOT NULL AUTO_INCREMENT,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `instructor` int DEFAULT NULL,
  `horario` int DEFAULT NULL,
  `tipo` enum('Formacion','Seguimiento','Administrativo') DEFAULT NULL,
  `solicitud` enum('Solicitado','Aprobado','No Aprobado') DEFAULT NULL,
  PRIMARY KEY (`id_actividad`),
  KEY `vinculacion_horario` (`instructor`),
  KEY `horario_vinculacion` (`horario`),
  CONSTRAINT `horario_vinculacion` FOREIGN KEY (`horario`) REFERENCES `horarios` (`id_horario`),
  CONSTRAINT `vinculacion_instructor` FOREIGN KEY (`instructor`) REFERENCES `personas` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `actividades` */

/*Table structure for table `ambientes` */

DROP TABLE IF EXISTS `ambientes`;

CREATE TABLE `ambientes` (
  `id_ambiente` int NOT NULL AUTO_INCREMENT,
  `nombre_amb` varchar(80) DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_ambiente`),
  KEY `municipio_ambiente` (`municipio`),
  CONSTRAINT `municipio_ambiente` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `ambientes` */

/*Table structure for table `areas` */

DROP TABLE IF EXISTS `areas`;

CREATE TABLE `areas` (
  `id_area` int NOT NULL AUTO_INCREMENT,
  `nombre_area` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id_area`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `areas` */

insert  into `areas`(`id_area`,`nombre_area`) values (1,'Tic');

/*Table structure for table `asignaciones` */

DROP TABLE IF EXISTS `asignaciones`;

CREATE TABLE `asignaciones` (
  `id_asignacion` int NOT NULL AUTO_INCREMENT,
  `actividad` int DEFAULT NULL,
  `productiva` int DEFAULT NULL,
  PRIMARY KEY (`id_asignacion`),
  KEY `asignaciones_actividad` (`actividad`),
  KEY `asignaciones_productivas` (`productiva`),
  CONSTRAINT `asignaciones_actividad` FOREIGN KEY (`actividad`) REFERENCES `actividades` (`id_actividad`),
  CONSTRAINT `asignaciones_productivas` FOREIGN KEY (`productiva`) REFERENCES `productivas` (`id_productiva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `asignaciones` */

/*Table structure for table `bitacoras` */

DROP TABLE IF EXISTS `bitacoras`;

CREATE TABLE `bitacoras` (
  `id_bitacora` int NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  `bitacora` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `seguimiento` int DEFAULT NULL,
  `pdf` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `estado` enum('solicitud','aprobado','no aprobado') DEFAULT NULL,
  `instructor` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_bitacora`),
  KEY `seguimiento_bitacora` (`seguimiento`),
  CONSTRAINT `seguimiento_bitacora` FOREIGN KEY (`seguimiento`) REFERENCES `seguimientos` (`id_seguimiento`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `bitacoras` */

insert  into `bitacoras`(`id_bitacora`,`fecha`,`bitacora`,`seguimiento`,`pdf`,`estado`,`instructor`) values (1,'2023-05-03','1',1,NULL,'solicitud','Wilson Martinez Saldarriaga'),(2,NULL,'2',1,NULL,'aprobado','Wilson Martinez Saldarriaga'),(3,NULL,'1',2,NULL,'aprobado','Wilson Martinez S.'),(4,NULL,'1',3,NULL,'no aprobado','Wilson Martinez'),(5,'2023-05-16','1',4,NULL,'aprobado','Wilson MArtinez S.');

/*Table structure for table `empresas` */

DROP TABLE IF EXISTS `empresas`;

CREATE TABLE `empresas` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(80) DEFAULT NULL,
  `direccion` varchar(80) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(80) DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `jefe_inmediato` varchar(50) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_empresa`),
  KEY `empresa_minicipio` (`municipio`),
  CONSTRAINT `empresa_minicipio` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `empresas` */

insert  into `empresas`(`id_empresa`,`razon_social`,`direccion`,`telefono`,`correo`,`municipio`,`jefe_inmediato`,`estado`) values (3,'Chaquira','car2','3232332',NULL,1,NULL,'Activo'),(4,'111','111','111','11',1,NULL,'Inactivo'),(5,'2222','2222','222','222',1,NULL,'Inactivo'),(6,'1111','2222','111','111',1,NULL,'Activo');

/*Table structure for table `fichas` */

DROP TABLE IF EXISTS `fichas`;

CREATE TABLE `fichas` (
  `codigo` int NOT NULL,
  `inicio_ficha` date DEFAULT NULL,
  `fin_lectiva` date DEFAULT NULL,
  `fin_ficha` datetime DEFAULT NULL,
  `programa` int DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `estado` enum('Lecttiva','Electiva','Finalizado') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `ficha_programa` (`programa`),
  CONSTRAINT `ficha_programa` FOREIGN KEY (`programa`) REFERENCES `programas` (`id_programa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `fichas` */

insert  into `fichas`(`codigo`,`inicio_ficha`,`fin_lectiva`,`fin_ficha`,`programa`,`sede`,`estado`) values (2692929,'2023-02-01','2024-06-03',NULL,1,'yamboro','Electiva');

/*Table structure for table `horarios` */

DROP TABLE IF EXISTS `horarios`;

CREATE TABLE `horarios` (
  `id_horario` int NOT NULL AUTO_INCREMENT,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `dia` enum('lunes','martes','miercoles','jueves','viernes','sabados','domingo') DEFAULT NULL,
  `horas` int DEFAULT NULL,
  `ficha` int DEFAULT NULL,
  `ambiente` int DEFAULT NULL,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_horario`),
  KEY `hoario_ambiente` (`ambiente`),
  KEY `horario_ficha` (`ficha`),
  CONSTRAINT `hoario_ambiente` FOREIGN KEY (`ambiente`) REFERENCES `ambientes` (`id_ambiente`),
  CONSTRAINT `horario_ficha` FOREIGN KEY (`ficha`) REFERENCES `fichas` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `horarios` */

/*Table structure for table `matriculas` */

DROP TABLE IF EXISTS `matriculas`;

CREATE TABLE `matriculas` (
  `id_matricula` int NOT NULL AUTO_INCREMENT,
  `ficha` int DEFAULT NULL,
  `aprendiz` int DEFAULT NULL,
  `estado` enum('Inducción','Formación','Condicionado','Cancelado','Retiro Voluntario','Por Certificar','Certificado') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `pendiente_tecnicos` int DEFAULT NULL,
  `pendiente_transversales` int DEFAULT NULL,
  `pendiente_ingles` int DEFAULT NULL,
  PRIMARY KEY (`id_matricula`),
  UNIQUE KEY `uiniquematricula` (`ficha`,`aprendiz`),
  KEY `matriculas_personas` (`aprendiz`),
  CONSTRAINT `matricula_ficha` FOREIGN KEY (`ficha`) REFERENCES `fichas` (`codigo`),
  CONSTRAINT `matriculas_personas` FOREIGN KEY (`aprendiz`) REFERENCES `personas` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `matriculas` */

insert  into `matriculas`(`id_matricula`,`ficha`,`aprendiz`,`estado`,`pendiente_tecnicos`,`pendiente_transversales`,`pendiente_ingles`) values (13,2692929,3,'Formación',8,2,0),(18,2692929,2,'Formación',8,8,8),(20,2692929,8,'Formación',0,0,0);

/*Table structure for table `municipios` */

DROP TABLE IF EXISTS `municipios`;

CREATE TABLE `municipios` (
  `id_municipio` int NOT NULL AUTO_INCREMENT,
  `nombre_mpio` varchar(80) DEFAULT NULL,
  `departamento` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id_municipio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `municipios` */

insert  into `municipios`(`id_municipio`,`nombre_mpio`,`departamento`) values (1,'Pitalito','Huila');

/*Table structure for table `novedades` */

DROP TABLE IF EXISTS `novedades`;

CREATE TABLE `novedades` (
  `id_novedad` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `foto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `seguimiento` int DEFAULT NULL,
  `instructor` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_novedad`),
  KEY `actividad_seguimiento` (`seguimiento`),
  CONSTRAINT `seguimiento_actividad` FOREIGN KEY (`seguimiento`) REFERENCES `seguimientos` (`id_seguimiento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `novedades` */

/*Table structure for table `personas` */

DROP TABLE IF EXISTS `personas`;

CREATE TABLE `personas` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `identificacion` bigint DEFAULT NULL,
  `nombres` varchar(80) DEFAULT NULL,
  `correo` varchar(80) DEFAULT NULL,
  `telefono` varchar(40) DEFAULT NULL,
  `password` varchar(25) DEFAULT NULL,
  `rol` enum('Instructor','Coordinador','Lider','Seguimiento','Aprendiz') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cargo` enum('Instructor','Aprendiz','Coordinador','Administrativo') DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `tipo` enum('contratista','planta') DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `area` int DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `identificacion_unique` (`identificacion`),
  KEY `persona_municipio` (`municipio`),
  KEY `area_personas` (`area`),
  CONSTRAINT `area_personas` FOREIGN KEY (`area`) REFERENCES `areas` (`id_area`),
  CONSTRAINT `persona_municipio` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `personas` */

insert  into `personas`(`id_persona`,`identificacion`,`nombres`,`correo`,`telefono`,`password`,`rol`,`cargo`,`municipio`,`tipo`,`sede`,`area`,`estado`) values (2,96361787,'Wilson Martinez Saldarriaga','1111','1111','123','Instructor','Instructor',1,NULL,NULL,NULL,NULL),(3,12345,'Juan Jose ','wilson@hotmail.com','321223312','1234',NULL,'Aprendiz',1,NULL,NULL,NULL,NULL),(4,123,'123','123','123',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL),(5,1234,'1234','1234','1234',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL),(6,13232321,'13123','213123','2123213',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL),(7,21212,'12121','1212','12121',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL),(8,123456,'Maria del Pilar','maria@gmail.com','11211',NULL,NULL,'Aprendiz',1,NULL,NULL,NULL,NULL);

/*Table structure for table `productivas` */

DROP TABLE IF EXISTS `productivas`;

CREATE TABLE `productivas` (
  `id_productiva` int NOT NULL AUTO_INCREMENT,
  `matricula` int DEFAULT NULL,
  `empresa` int DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `alternativa` enum('Contrato de Aprendizaje','Proyecto Productivo','Pasantias','Monitoria') DEFAULT NULL,
  `estado` enum('Inicio','Renuncia','Terminado') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `acuerdo` varchar(100) DEFAULT NULL,
  `arl` varchar(100) DEFAULT NULL,
  `consulta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `aprendiz` int DEFAULT NULL,
  PRIMARY KEY (`id_productiva`),
  KEY `aprendiz_matricula` (`matricula`),
  KEY `empresa_matricula` (`empresa`),
  CONSTRAINT `empresa_matricula` FOREIGN KEY (`empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `practica_aprendiz` FOREIGN KEY (`matricula`) REFERENCES `matriculas` (`id_matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `productivas` */

insert  into `productivas`(`id_productiva`,`matricula`,`empresa`,`fecha_inicio`,`fecha_fin`,`alternativa`,`estado`,`acuerdo`,`arl`,`consulta`,`aprendiz`) values (5,13,6,'2023-01-02','2023-04-29','Proyecto Productivo','Inicio','GD-F-007_Formato_de_Acta_WilsonMartinezSaldarriaga.pdf','Imagen1(1).png','ciclos.gif',NULL),(6,20,3,'2023-04-03','2023-10-31','Contrato de Aprendizaje','Inicio','img20230331_15561888.pdf',NULL,NULL,NULL);

/*Table structure for table `programas` */

DROP TABLE IF EXISTS `programas`;

CREATE TABLE `programas` (
  `id_programa` int NOT NULL AUTO_INCREMENT,
  `nombre_programa` varchar(80) DEFAULT NULL,
  `sigla` varchar(20) DEFAULT NULL,
  `nivel` enum('Tecnico','Tecnólogo') DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_programa`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `programas` */

insert  into `programas`(`id_programa`,`nombre_programa`,`sigla`,`nivel`,`estado`) values (1,'Tecnologo en Analisis y Desarrollo de Software','ADSO','Tecnólogo','activo');

/*Table structure for table `seguimientos` */

DROP TABLE IF EXISTS `seguimientos`;

CREATE TABLE `seguimientos` (
  `id_seguimiento` int NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  `seguimiento` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `estado` enum('solicitud','aprobado','no aprobado') DEFAULT NULL,
  `pdf` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `productiva` int DEFAULT NULL,
  `instructor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_seguimiento`),
  KEY `seguimiento_instructor` (`instructor`),
  KEY `seguimiento_productiva` (`productiva`),
  CONSTRAINT `seguimiento_productiva` FOREIGN KEY (`productiva`) REFERENCES `productivas` (`id_productiva`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `seguimientos` */

insert  into `seguimientos`(`id_seguimiento`,`fecha`,`seguimiento`,`estado`,`pdf`,`productiva`,`instructor`) values (1,'2023-05-03','1',NULL,NULL,NULL,NULL),(2,'2023-05-03','2','aprobado',NULL,NULL,NULL),(3,'2023-05-03','3','no aprobado',NULL,NULL,NULL),(4,'2023-05-09','1','solicitud',NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
