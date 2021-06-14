ALTER TABLE `m_reimbursement` ADD `is_deleted` TINYINT(5) NULL DEFAULT '0' AFTER `nilai`;
ALTER TABLE `m_reimbursement` ADD `tipe_expired` INT(5) NULL DEFAULT '0' AFTER `is_global`;