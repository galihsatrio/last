ALTER TABLE `k_sertifikat` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `k_sertifikat` ADD `is_deleted` TINYINT(5) NULL DEFAULT '0' AFTER `keterangan`;
INSERT INTO `m_user` (`id`, `nama`, `email`, `alamat`, `telepon`, `username`, `password`, `m_roles_id`, `is_deleted`) VALUES (NULL, 'admin', 'admin@admin.com', '', '', 'admin', SHA1('admin'), '2', '0');
INSERT INTO `m_roles` (`id`, `nama`, `akses`, `is_deleted`) VALUES (NULL, 'admin', '', '0');
INSERT INTO `m_user` (`id`, `nama`, `email`, `alamat`, `telepon`, `username`, `password`, `m_roles_id`, `is_deleted`) VALUES (NULL, 'hrd', '', '', '', 'hrd', SHA1('hrd'), '3', '0');
INSERT INTO `m_roles` (`id`, `nama`, `akses`, `is_deleted`) VALUES (NULL, 'hrd', '', '0');
INSERT INTO `m_roles` (`id`, `nama`, `akses`, `is_deleted`) VALUES (NULL, 'supervisor', '', '0');
INSERT INTO `m_roles` (`id`, `nama`, `akses`, `is_deleted`) VALUES (NULL, 'karyawan', '', '0');
INSERT INTO `m_user` (`id`, `nama`, `email`, `alamat`, `telepon`, `username`, `password`, `m_roles_id`, `is_deleted`) VALUES (NULL, 'supervisor', '', '', '', 'supervisor', SHA1('supervisor'), '4', '0'), (NULL, 'karyawan', '', '', '', 'karyawan', SHA1('karyawan'), '5', '0');