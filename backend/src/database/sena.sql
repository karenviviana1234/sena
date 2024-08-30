-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 28-08-2024 a las 14:16:19
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sena`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id_actividad` int NOT NULL,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `instructor` int DEFAULT NULL,
  `horario` int DEFAULT NULL,
  `productiva` int DEFAULT NULL,
  `tipo` enum('Formacion','Seguimiento','Administrativo') DEFAULT NULL,
  `solicitud` enum('Solicitado','Aprobado','No Aprobado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ambientes`
--

CREATE TABLE `ambientes` (
  `id_ambiente` int NOT NULL,
  `nombre_amb` varchar(80) DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` int NOT NULL,
  `nombre_area` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id_area`, `nombre_area`) VALUES
(1, 'TIC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacoras`
--

CREATE TABLE `bitacoras` (
  `id_bitacora` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `bitacora` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `seguimiento` int DEFAULT NULL,
  `pdf` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('solicitud','aprobado','no aprobado') DEFAULT NULL,
  `instructor` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int NOT NULL,
  `razon_social` varchar(80) DEFAULT NULL,
  `direccion` varchar(80) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(80) DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `jefe_inmediato` varchar(50) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `razon_social`, `direccion`, `telefono`, `correo`, `municipio`, `jefe_inmediato`, `estado`) VALUES
(1, 'Universal S.A.S', 'pitalito HUILA', '310890345354', 'universalsas@gmail.com', 1, 'Yohana Salamanca', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fichas`
--

CREATE TABLE `fichas` (
  `codigo` int NOT NULL,
  `inicio_ficha` date DEFAULT NULL,
  `fin_lectiva` date DEFAULT NULL,
  `fin_ficha` datetime DEFAULT NULL,
  `programa` int DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `estado` enum('Lecttiva','Electiva','Finalizado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fichas`
--

INSERT INTO `fichas` (`codigo`, `inicio_ficha`, `fin_lectiva`, `fin_ficha`, `programa`, `sede`, `estado`) VALUES
(2692929, '2024-08-22', '2025-08-22', '2026-02-22 00:00:00', 1, 'yamboro', 'Lecttiva');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` int NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `dia` enum('lunes','martes','miercoles','jueves','viernes','sabados','domingo') DEFAULT NULL,
  `horas` int DEFAULT NULL,
  `ficha` int DEFAULT NULL,
  `ambiente` int DEFAULT NULL,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matriculas`
--

CREATE TABLE `matriculas` (
  `id_matricula` int NOT NULL,
  `ficha` int DEFAULT NULL,
  `aprendiz` int DEFAULT NULL,
  `estado` enum('Inducción','Formación','Condicionado','Cancelado','Retiro Voluntario','Por Certificar','Certificado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pendiente_tecnicos` int DEFAULT NULL,
  `pendiente_transversales` int DEFAULT NULL,
  `pendiente_ingles` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `matriculas`
--

INSERT INTO `matriculas` (`id_matricula`, `ficha`, `aprendiz`, `estado`, `pendiente_tecnicos`, `pendiente_transversales`, `pendiente_ingles`) VALUES
(1, 2692929, 1, 'Formación', 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipios`
--

CREATE TABLE `municipios` (
  `id_municipio` int NOT NULL,
  `nombre_mpio` varchar(80) DEFAULT NULL,
  `departamento` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `municipios`
--

INSERT INTO `municipios` (`id_municipio`, `nombre_mpio`, `departamento`) VALUES
(1, 'Saladoblanco', 'Huila');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades`
--

CREATE TABLE `novedades` (
  `id_novedad` int NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `foto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `seguimiento` int DEFAULT NULL,
  `instructor` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id_persona` int NOT NULL,
  `identificacion` bigint DEFAULT NULL,
  `nombres` varchar(80) DEFAULT NULL,
  `correo` varchar(80) DEFAULT NULL,
  `telefono` varchar(40) DEFAULT NULL,
  `password` varchar(25) DEFAULT NULL,
  `rol` enum('Instructor','Coordinador','Lider','Seguimiento','Aprendiz') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cargo` enum('Instructor','Aprendiz','Coordinador','Administrativo') DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `tipo` enum('contratista','planta') DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `area` int DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id_persona`, `identificacion`, `nombres`, `correo`, `telefono`, `password`, `rol`, `cargo`, `municipio`, `tipo`, `sede`, `area`, `estado`) VALUES
(1, 1081729608, 'Sharit Daniela Vargas Almario', 'sharitv@gmail.com', '310890345354', 'sharit123', 'Aprendiz', 'Aprendiz', 1, 'contratista', 'yamboro', 1, 'Activo'),
(2, 234562345, 'Sara Restrepo', 'sarart@gmail.com', '310890345354', 'sharit123', 'Instructor', 'Instructor', 1, 'contratista', 'yamboro', 1, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productiva`
--

CREATE TABLE `productiva` (
  `id_productiva` int NOT NULL,
  `matricula` int DEFAULT NULL,
  `empresa` int DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `alternativa` enum('Contrato de Aprendizaje','Proyecto Productivo','Pasantias','Monitoria') DEFAULT NULL,
  `estado` enum('Inicio','Renuncia','Terminado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acuerdo` varchar(100) DEFAULT NULL,
  `arl` varchar(100) DEFAULT NULL,
  `consulta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `aprendiz` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productiva`
--

INSERT INTO `productiva` (`id_productiva`, `matricula`, `empresa`, `fecha_inicio`, `fecha_fin`, `alternativa`, `estado`, `acuerdo`, `arl`, `consulta`, `aprendiz`) VALUES
(1, 1, 1, '2025-08-22', '2026-02-22', 'Contrato de Aprendizaje', 'Inicio', 'sdf', 'dsf', 'sdf', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programas`
--

CREATE TABLE `programas` (
  `id_programa` int NOT NULL,
  `nombre_programa` varchar(80) DEFAULT NULL,
  `sigla` varchar(20) DEFAULT NULL,
  `nivel` enum('Tecnico','Tecnólogo') DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `programas`
--

INSERT INTO `programas` (`id_programa`, `nombre_programa`, `sigla`, `nivel`, `estado`) VALUES
(1, 'Analisis y Desarrollo de Software', 'ADSO', 'Tecnólogo', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimientos`
--

CREATE TABLE `seguimientos` (
  `id_seguimiento` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `seguimiento` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('solicitud','aprobado','no aprobado') DEFAULT NULL,
  `pdf` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `productiva` int DEFAULT NULL,
  `instructor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seguimientos`
--

INSERT INTO `seguimientos` (`id_seguimiento`, `fecha`, `seguimiento`, `estado`, `pdf`, `productiva`, `instructor`) VALUES
(1, '2024-10-22', '1', 'aprobado', 'asdfgh', 1, '2');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `vinculacion_horario` (`instructor`),
  ADD KEY `horario_vinculacion` (`horario`),
  ADD KEY `productiva_actividad` (`productiva`);

--
-- Indices de la tabla `ambientes`
--
ALTER TABLE `ambientes`
  ADD PRIMARY KEY (`id_ambiente`),
  ADD KEY `municipio_ambiente` (`municipio`);

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id_area`);

--
-- Indices de la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  ADD PRIMARY KEY (`id_bitacora`),
  ADD KEY `seguimiento_bitacora` (`seguimiento`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD KEY `empresa_minicipio` (`municipio`);

--
-- Indices de la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `ficha_programa` (`programa`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `hoario_ambiente` (`ambiente`),
  ADD KEY `horario_ficha` (`ficha`);

--
-- Indices de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD PRIMARY KEY (`id_matricula`),
  ADD UNIQUE KEY `uiniquematricula` (`ficha`,`aprendiz`),
  ADD KEY `matriculas_personas` (`aprendiz`);

--
-- Indices de la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD PRIMARY KEY (`id_municipio`);

--
-- Indices de la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD PRIMARY KEY (`id_novedad`),
  ADD KEY `actividad_seguimiento` (`seguimiento`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id_persona`),
  ADD UNIQUE KEY `identificacion_unique` (`identificacion`),
  ADD KEY `persona_municipio` (`municipio`),
  ADD KEY `area_personas` (`area`);

--
-- Indices de la tabla `productiva`
--
ALTER TABLE `productiva`
  ADD PRIMARY KEY (`id_productiva`),
  ADD KEY `aprendiz_matricula` (`matricula`),
  ADD KEY `empresa_matricula` (`empresa`);

--
-- Indices de la tabla `programas`
--
ALTER TABLE `programas`
  ADD PRIMARY KEY (`id_programa`);

--
-- Indices de la tabla `seguimientos`
--
ALTER TABLE `seguimientos`
  ADD PRIMARY KEY (`id_seguimiento`),
  ADD KEY `seguimiento_instructor` (`instructor`),
  ADD KEY `seguimiento_productiva` (`productiva`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id_actividad` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ambientes`
--
ALTER TABLE `ambientes`
  MODIFY `id_ambiente` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  MODIFY `id_bitacora` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  MODIFY `id_matricula` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `municipios`
--
ALTER TABLE `municipios`
  MODIFY `id_municipio` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `novedades`
--
ALTER TABLE `novedades`
  MODIFY `id_novedad` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id_persona` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `productiva`
--
ALTER TABLE `productiva`
  MODIFY `id_productiva` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `programas`
--
ALTER TABLE `programas`
  MODIFY `id_programa` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `seguimientos`
--
ALTER TABLE `seguimientos`
  MODIFY `id_seguimiento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `horario_vinculacion` FOREIGN KEY (`horario`) REFERENCES `horarios` (`id_horario`),
  ADD CONSTRAINT `productiva_actividad` FOREIGN KEY (`productiva`) REFERENCES `productiva` (`id_productiva`),
  ADD CONSTRAINT `vinculacion_instructor` FOREIGN KEY (`instructor`) REFERENCES `personas` (`id_persona`);

--
-- Filtros para la tabla `ambientes`
--
ALTER TABLE `ambientes`
  ADD CONSTRAINT `municipio_ambiente` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  ADD CONSTRAINT `seguimiento_bitacora` FOREIGN KEY (`seguimiento`) REFERENCES `seguimientos` (`id_seguimiento`);

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `empresa_minicipio` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD CONSTRAINT `ficha_programa` FOREIGN KEY (`programa`) REFERENCES `programas` (`id_programa`);

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `hoario_ambiente` FOREIGN KEY (`ambiente`) REFERENCES `ambientes` (`id_ambiente`),
  ADD CONSTRAINT `horario_ficha` FOREIGN KEY (`ficha`) REFERENCES `fichas` (`codigo`);

--
-- Filtros para la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD CONSTRAINT `matricula_ficha` FOREIGN KEY (`ficha`) REFERENCES `fichas` (`codigo`),
  ADD CONSTRAINT `matriculas_personas` FOREIGN KEY (`aprendiz`) REFERENCES `personas` (`id_persona`);

--
-- Filtros para la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD CONSTRAINT `seguimiento_actividad` FOREIGN KEY (`seguimiento`) REFERENCES `seguimientos` (`id_seguimiento`);

--
-- Filtros para la tabla `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `area_personas` FOREIGN KEY (`area`) REFERENCES `areas` (`id_area`),
  ADD CONSTRAINT `persona_municipio` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `productiva`
--
ALTER TABLE `productiva`
  ADD CONSTRAINT `empresa_matricula` FOREIGN KEY (`empresa`) REFERENCES `empresa` (`id_empresa`),
  ADD CONSTRAINT `practica_aprendiz` FOREIGN KEY (`matricula`) REFERENCES `matriculas` (`id_matricula`);

--
-- Filtros para la tabla `seguimientos`
--
ALTER TABLE `seguimientos`
  ADD CONSTRAINT `seguimiento_productiva` FOREIGN KEY (`productiva`) REFERENCES `productiva` (`id_productiva`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
