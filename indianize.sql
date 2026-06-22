-- ============================================================
-- INDIANIZATION: Update settings for Indian matrimonial portal
-- ============================================================

-- 1. Update site branding
UPDATE `settings` SET `value` = 'Vivaah Setu', `updated_at` = NOW() WHERE `type` = 'website_name';
UPDATE `settings` SET `value` = 'Bharat ka Vishwasniya Vivah Website', `updated_at` = NOW() WHERE `type` = 'site_motto';

-- 2. Update theme colors - Indian wedding palette (saffron, red, gold)
UPDATE `settings` SET `value` = '#FF6B6B', `updated_at` = NOW() WHERE `type` = 'base_color';
UPDATE `settings` SET `value` = '#C0392B', `updated_at` = NOW() WHERE `type` = 'base_hov_color';
UPDATE `settings` SET `value` = '#FF8C00', `updated_at` = NOW() WHERE `type` = 'secondary_color';

-- 3. Update helpline to Indian number
UPDATE `settings` SET `value` = '+91 9876543210', `updated_at` = NOW() WHERE `type` = 'header_helpline_no';

-- 4. Fix INR currency entry - update symbol to ₹, code to INR, rate to 1
UPDATE `currencies` SET `symbol` = '₹', `code` = 'INR', `exchange_rate` = 1.00000, `updated_at` = NOW() WHERE `id` = 28;

-- 5. Set INR as system default currency (id=28)
UPDATE `settings` SET `value` = '28', `updated_at` = NOW() WHERE `type` = 'system_default_currency';

-- 6. Update USD exchange rate relative to INR
UPDATE `currencies` SET `exchange_rate` = 83.00000, `updated_at` = NOW() WHERE `id` = 1;

-- 7. Add Hindi language
INSERT INTO `languages` (`name`, `code`, `rtl`, `status`, `created_at`, `updated_at`) 
SELECT * FROM (SELECT 'Hindi' AS name, 'hi' AS code, 0 AS rtl, 1 AS status, NOW() AS created_at, NOW() AS updated_at) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `languages` WHERE `code` = 'hi');
