ALTER TABLE `m_kategori_file` CHANGE `id` `id` INT(5) NOT NULL AUTO_INCREMENT;
ALTER TABLE `k_pelatihan` ADD `is_deleted` TINYINT(5) NULL DEFAULT '0' AFTER `keterangan`;
ALTER TABLE `m_kategori_file` ADD `is_deleted` TINYINT(5) NULL DEFAULT '0' AFTER `m_perusahaan_id`;
