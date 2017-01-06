-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Янв 06 2017 г., 16:15
-- Версия сервера: 5.5.49
-- Версия PHP: 5.3.10-1ubuntu3.23

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `tomato`
--

-- --------------------------------------------------------

--
-- Структура таблицы `calendar`
--

CREATE TABLE IF NOT EXISTS `calendar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pin` varchar(2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `timestart` datetime NOT NULL,
  `timestop` datetime NOT NULL,
  `color` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=myisam DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `pin`
--

CREATE TABLE IF NOT EXISTS `pin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pin` varchar(2) NOT NULL,
  `mode` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=myisam  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `pin`
--

INSERT INTO `pin` (`id`, `pin`, `mode`, `description`) VALUES
(1, '4', 'relay', 'реле'),
(2, '2', 'relay', 'реле'),
(3, '7', 'relay', 'реле'),
(4, '8', 'relay', 'реле'),
(5, '9', 'servo', 'серво');

-- --------------------------------------------------------

--
-- Структура таблицы `relay`
--

CREATE TABLE IF NOT EXISTS `relay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pin` varchar(2) NOT NULL,
  `description` varchar(100) NOT NULL,
  `calendar` varchar(100) NOT NULL,
  `worktime` varchar(100) NOT NULL,
  `noworktime` varchar(20) NOT NULL,
  `lasttime` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=myisam  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `relay`
--

INSERT INTO `relay` (`id`, `pin`, `description`, `calendar`, `worktime`, `noworktime`, `lasttime`, `status`) VALUES
(1, '2', 'light', '', '', '', '0000-00-00 00:00:00', '0'),
(2, '4', 'water', '', '', '', '0000-00-00 00:00:00', '0'),
(3, '7', 'steam', '', '', '', '0000-00-00 00:00:00', '0'),
(4, '8', 'mixer', '', '', '', '0000-00-00 00:00:00', '-1');

-- --------------------------------------------------------

--
-- Структура таблицы `servo`
--

CREATE TABLE IF NOT EXISTS `servo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pin` varchar(2) NOT NULL,
  `descriprion` varchar(100) NOT NULL,
  `degree-start` varchar(3) NOT NULL,
  `degree-stop` varchar(3) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=myisam  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `servo`
--

INSERT INTO `servo` (`id`, `pin`, `descriprion`, `degree-start`, `degree-stop`, `status`) VALUES
(1, '9', 'сервопривод', '0.5', '2.3', '-1');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `secret` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=myisam  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `secret`) VALUES
(2, 'admin', 'admin155');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
