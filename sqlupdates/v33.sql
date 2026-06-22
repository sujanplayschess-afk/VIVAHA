ALTER TABLE `members`
CHANGE `birthday` `birthday` DATETIME NULL DEFAULT NULL,
CHANGE `current_package_id` `current_package_id` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL;

ALTER TABLE `users` ADD `balance` DOUBLE(20,0) NOT NULL DEFAULT '0.00' AFTER `approved`;

INSERT INTO `settings` (`id`, `type`, `value`, `created_at`, `updated_at`, `deleted_at`)
VALUES
(NULL, 'wallet_system', '1', current_timestamp(), current_timestamp(), NULL);

UPDATE `settings` SET `value` = '3.3' WHERE `settings`.`type` = 'current_version';

CREATE TABLE `wallets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` double(20,2) NOT NULL,
  `payment_method` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `payment_details` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `approval` int(1) NOT NULL DEFAULT 0,
  `offline_payment` int(1) NOT NULL DEFAULT 0,
  `reciept` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;
