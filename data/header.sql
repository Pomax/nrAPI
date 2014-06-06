CREATE DATABASE jmdict;

CONNECT jmdict;

CREATE TABLE dictionary_JSON         (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_reb          (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_keb          (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_sense_xref   (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_sense_ant    (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_pos          (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_eng          (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_reb_lookup_1 (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_reb_lookup   (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, `revdata` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_keb_lookup_1 (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_keb_lookup   (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8 COLLATE utf8_bin, `revdata` text CHARACTER SET utf8 COLLATE utf8_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
CREATE TABLE dictionary_eng_LUT      (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `term` text CHARACTER SET utf8 COLLATE utf8_bin, `position` int(12) NOT NULL, `type` int(12) NOT NULL, KEY `id` (`id`)) DEFAULT CHARSET=utf8;
