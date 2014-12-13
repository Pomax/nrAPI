CREATE DATABASE jmdict;

CONNECT jmdict;

# dictionary data
CREATE TABLE dictionary_JSON         (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_reb          (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_keb          (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_sense_xref   (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_sense_ant    (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_pos          (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_reb_lookup_1 (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_reb_lookup   (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, `revdata` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_keb_lookup_1 (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE dictionary_keb_lookup   (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, `revdata` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
# english should match case insensitive
CREATE TABLE dictionary_eng          (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, KEY `id` (`id`), FULLTEXT(`data`)) DEFAULT CHARSET=utf8mb4 ENGINE=InnoDB;
CREATE TABLE dictionary_eng_LUT      (`id` int(12) NOT NULL, `sense` int(12) NOT NULL, `term` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, `position` int(12) NOT NULL, `type` int(12) NOT NULL, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;

# kanji dictionary data
CREATE TABLE kanji_dictionary_JSON      (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE kanji_dictionary_reb       (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE kanji_dictionary_rad       (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE kanji_dictionary_grade     (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE kanji_dictionary_strokes   (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE kanji_dictionary_frequency (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE kanji_dictionary_jlpt      (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
# english should match case insensitive
CREATE TABLE kanji_dictionary_eng       (`id` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, KEY `id` (`id`), FULLTEXT(`data`)) DEFAULT CHARSET=utf8mb4 ENGINE=InnoDB;

# name dictionary data
CREATE TABLE name_dictionary_JSON (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE name_dictionary_keb  (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
CREATE TABLE name_dictionary_reb  (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
# english and type should match case insensitive
CREATE TABLE name_dictionary_eng  (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, KEY `id` (`id`), FULLTEXT(`data`)) DEFAULT CHARSET=utf8mb4 ENGINE=InnoDB;
CREATE TABLE name_dictionary_type (`id` int(12) NOT NULL, `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, KEY `id` (`id`)) DEFAULT CHARSET=utf8mb4;
