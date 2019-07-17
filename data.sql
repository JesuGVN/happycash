-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 09 2019 г., 10:55
-- Версия сервера: 5.6.38
-- Версия PHP: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `telegram_bot`
--

-- --------------------------------------------------------

--
-- Структура таблицы `comp_repl`
--

CREATE TABLE `comp_repl` (
  `ID` int(255) NOT NULL,
  `TG_ID` int(255) NOT NULL,
  `USER_NAME` varchar(255) NOT NULL,
  `SUM` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `conclusion`
--

CREATE TABLE `conclusion` (
  `ID` int(255) NOT NULL,
  `USER_ID` int(255) NOT NULL,
  `USER_NAME` varchar(255) NOT NULL,
  `SUM` varchar(255) NOT NULL,
  `PAY_PROPS` varchar(255) NOT NULL,
  `USER_PAY_SYSTEM` varchar(255) NOT NULL,
  `REPL` varchar(255) NOT NULL,
  `SUCCESS` int(255) NOT NULL DEFAULT '0',
  `GAMES_COUNT` int(255) NOT NULL DEFAULT '0',
  `WINS` varchar(255) NOT NULL,
  `LOSSES` varchar(255) NOT NULL,
  `DATE` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `game_list`
--

CREATE TABLE `game_list` (
  `ID` int(255) NOT NULL,
  `USER_ID` int(11) NOT NULL,
  `USER_NAME` varchar(255) NOT NULL DEFAULT 'NO_NAME',
  `STATUS` varchar(25) NOT NULL,
  `RATE` varchar(255) NOT NULL,
  `GAME_NUMBER` int(255) NOT NULL,
  `WIN` varchar(255) NOT NULL DEFAULT '0',
  `DATE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `promocodes`
--

CREATE TABLE `promocodes` (
  `ID` int(255) NOT NULL,
  `PROMO` varchar(255) NOT NULL,
  `SUM` int(255) NOT NULL,
  `ACTIVATION_COUNT` int(255) NOT NULL,
  `ACTIVATED` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `promologs`
--

CREATE TABLE `promologs` (
  `ID` int(255) NOT NULL,
  `PROMO` varchar(255) NOT NULL,
  `USER_ID` int(255) NOT NULL,
  `USER_NAME` varchar(255) NOT NULL,
  `DATE` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `replenishment`
--

CREATE TABLE `replenishment` (
  `ID` int(255) NOT NULL,
  `USER_ID` int(255) NOT NULL,
  `USER_NAME` varchar(255) NOT NULL,
  `USER_EMAIL` varchar(255) NOT NULL DEFAULT 'none',
  `SUM` varchar(255) NOT NULL,
  `SUCCESS` varchar(255) NOT NULL DEFAULT 'false',
  `intid` int(11) NOT NULL DEFAULT '0',
  `DATE` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `ID` int(255) NOT NULL,
  `TG_ID` int(15) NOT NULL,
  `USER_NAME` varchar(255) NOT NULL,
  `USER_FIRST_NAME` varchar(255) NOT NULL,
  `IS_BAN` varchar(55) NOT NULL DEFAULT 'false',
  `USER_BALANCE` varchar(11) NOT NULL DEFAULT '0',
  `USER_DEFAULT_SUM` varchar(11) NOT NULL DEFAULT '1',
  `USER_DEFAULT_CHANCE` int(11) NOT NULL DEFAULT '80',
  `USER_REF` varchar(255) NOT NULL DEFAULT '0',
  `USER_PAY_SYSTEM` varchar(255) NOT NULL,
  `SIGNATURE` varchar(255) NOT NULL,
  `SIGNATURE_2` varchar(255) NOT NULL,
  `USER_TOTAL_RECHARGE` varchar(255) NOT NULL DEFAULT '0',
  `USER_REG_DATE` varchar(255) NOT NULL,
  `MODE` varchar(255) NOT NULL DEFAULT 'PLAY_MODE',
  `LAST_BONUS_DATE` varchar(255) NOT NULL,
  `COMP` int(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `comp_repl`
--
ALTER TABLE `comp_repl`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `conclusion`
--
ALTER TABLE `conclusion`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `game_list`
--
ALTER TABLE `game_list`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `promocodes`
--
ALTER TABLE `promocodes`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `promologs`
--
ALTER TABLE `promologs`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `replenishment`
--
ALTER TABLE `replenishment`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `comp_repl`
--
ALTER TABLE `comp_repl`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `conclusion`
--
ALTER TABLE `conclusion`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `game_list`
--
ALTER TABLE `game_list`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `promocodes`
--
ALTER TABLE `promocodes`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `promologs`
--
ALTER TABLE `promologs`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `replenishment`
--
ALTER TABLE `replenishment`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
