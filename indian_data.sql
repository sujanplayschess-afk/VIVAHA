-- ============================================================
-- INDIAN REFERENCE DATA FOR MATRIMONIAL SITE
-- ============================================================

-- 1. RELIGIONS (Indian context)
INSERT INTO religions (id, name, created_at, updated_at) VALUES
(1, 'Hindu', NOW(), NOW()),
(2, 'Muslim', NOW(), NOW()),
(3, 'Christian', NOW(), NOW()),
(4, 'Sikh', NOW(), NOW()),
(5, 'Jain', NOW(), NOW()),
(6, 'Buddhist', NOW(), NOW()),
(7, 'Parsi', NOW(), NOW()),
(8, 'Jewish', NOW(), NOW()),
(9, 'Spiritual', NOW(), NOW()),
(10, 'No Religion', NOW(), NOW());

-- 2. MEMBER LANGUAGES (Mother Tongues - Indian languages)
INSERT INTO member_languages (id, name, created_at, updated_at) VALUES
(1, 'Hindi', NOW(), NOW()),
(2, 'Gujarati', NOW(), NOW()),
(3, 'Marathi', NOW(), NOW()),
(4, 'Punjabi', NOW(), NOW()),
(5, 'Bengali', NOW(), NOW()),
(6, 'Tamil', NOW(), NOW()),
(7, 'Telugu', NOW(), NOW()),
(8, 'Kannada', NOW(), NOW()),
(9, 'Malayalam', NOW(), NOW()),
(10, 'Odia', NOW(), NOW()),
(11, 'Urdu', NOW(), NOW()),
(12, 'Sindhi', NOW(), NOW()),
(13, 'Assamese', NOW(), NOW()),
(14, 'Sanskrit', NOW(), NOW()),
(15, 'English', NOW(), NOW()),
(16, 'Rajasthani', NOW(), NOW()),
(17, 'Bhojpuri', NOW(), NOW()),
(18, 'Haryanvi', NOW(), NOW()),
(19, 'Maithili', NOW(), NOW()),
(20, 'Konkani', NOW(), NOW());

-- 3. MARITAL STATUSES
INSERT INTO marital_statuses (id, name, created_at, updated_at) VALUES
(1, 'Never Married', NOW(), NOW()),
(2, 'Widowed', NOW(), NOW()),
(3, 'Divorced', NOW(), NOW()),
(4, 'Awaiting Divorce', NOW(), NOW()),
(5, 'Annulled', NOW(), NOW());

-- 4. ON BEHALVES (Who is creating the profile)
INSERT INTO on_behalves (id, name, created_at, updated_at) VALUES
(1, 'Self', NOW(), NOW()),
(2, 'Son', NOW(), NOW()),
(3, 'Daughter', NOW(), NOW()),
(4, 'Brother', NOW(), NOW()),
(5, 'Sister', NOW(), NOW()),
(6, 'Father', NOW(), NOW()),
(7, 'Mother', NOW(), NOW()),
(8, 'Friend', NOW(), NOW()),
(9, 'Relative', NOW(), NOW());

-- 5. FAMILY VALUES
INSERT INTO family_values (id, name, created_at, updated_at) VALUES
(1, 'Traditional', NOW(), NOW()),
(2, 'Moderate', NOW(), NOW()),
(3, 'Liberal', NOW(), NOW()),
(4, 'Orthodox', NOW(), NOW());

-- 6. FAMILY STATUSES
INSERT INTO family_statuses (id, name, created_at, updated_at) VALUES
(1, 'Rich / Affluent', NOW(), NOW()),
(2, 'Upper Middle Class', NOW(), NOW()),
(3, 'Middle Class', NOW(), NOW()),
(4, 'Lower Middle Class', NOW(), NOW());

-- 7. HINDU CASTES (sample major castes)
INSERT INTO castes (id, name, religion_id, created_at, updated_at) VALUES
(1, 'Brahmin', 1, NOW(), NOW()),
(2, 'Rajput', 1, NOW(), NOW()),
(3, 'Vaishya', 1, NOW(), NOW()),
(4, 'Patel', 1, NOW(), NOW()),
(5, 'Vankar', 1, NOW(), NOW()),
(6, 'Khatri', 1, NOW(), NOW()),
(7, 'Jat', 1, NOW(), NOW()),
(8, 'Maratha', 1, NOW(), NOW()),
(9, 'Kayastha', 1, NOW(), NOW()),
(10, 'Kurmi', 1, NOW(), NOW()),
(11, 'Yadav', 1, NOW(), NOW()),
(12, 'SC', 1, NOW(), NOW()),
(13, 'ST', 1, NOW(), NOW()),
(14, 'OBC', 1, NOW(), NOW()),
(15, 'General', 1, NOW(), NOW()),
(16, 'Gupta', 1, NOW(), NOW()),
(17, 'Agarwal', 1, NOW(), NOW()),
(18, 'Lohana', 1, NOW(), NOW()),
(19, 'Koli', 1, NOW(), NOW()),
(20, 'Thakor', 1, NOW(), NOW());

-- 8. MUSLIM CASTES
INSERT INTO castes (id, name, religion_id, created_at, updated_at) VALUES
(21, 'Sheikh', 2, NOW(), NOW()),
(22, 'Syed', 2, NOW(), NOW()),
(23, 'Mughal', 2, NOW(), NOW()),
(24, 'Pathan', 2, NOW(), NOW()),
(25, 'Ansari', 2, NOW(), NOW()),
(26, 'Qureshi', 2, NOW(), NOW());

-- 9. CHRISTIAN CASTES
INSERT INTO castes (id, name, religion_id, created_at, updated_at) VALUES
(27, 'Catholic', 3, NOW(), NOW()),
(28, 'Protestant', 3, NOW(), NOW()),
(29, 'Syrian Christian', 3, NOW(), NOW()),
(30, 'Marthoma', 3, NOW(), NOW()),
(31, 'CSI', 3, NOW(), NOW());

-- 10. SIKH CASTES
INSERT INTO castes (id, name, religion_id, created_at, updated_at) VALUES
(32, 'Jatt Sikh', 4, NOW(), NOW()),
(33, 'Khatri Sikh', 4, NOW(), NOW()),
(34, 'Ramdasia Sikh', 4, NOW(), NOW()),
(35, 'Mazhbi Sikh', 4, NOW(), NOW());

-- 11. JAIN CASTES
INSERT INTO castes (id, name, religion_id, created_at, updated_at) VALUES
(36, 'Shwetambar', 5, NOW(), NOW()),
(37, 'Digambar', 5, NOW(), NOW()),
(38, 'Oswal', 5, NOW(), NOW()),
(39, 'Jain - Others', 5, NOW(), NOW());
