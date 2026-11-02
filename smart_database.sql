-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 02, 2026 at 10:21 AM
-- Server version: 8.4.3
-- PHP Version: 8.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `rcsa_assessment`
--

CREATE TABLE `rcsa_assessment` (
  `id` int NOT NULL,
  `rcsa_master_id` int NOT NULL,
  `jenis_risiko` varchar(100) DEFAULT NULL,
  `unit_id` int NOT NULL,
  `created_by` int NOT NULL,
  `potensi_risiko` text,
  `penyebab_risiko` text,
  `status` enum('draft','submitted','reviewed') DEFAULT 'draft',
  `dampak_inheren` int DEFAULT NULL,
  `frekuensi_inheren` int DEFAULT NULL,
  `nilai_inheren` int DEFAULT NULL,
  `level_inheren` enum('Rendah','Sedang','Tinggi','Sangat Tinggi') DEFAULT NULL,
  `pengendalian` text,
  `dampak_residual` int DEFAULT NULL,
  `kemungkinan_residual` int DEFAULT NULL,
  `nilai_residual` int DEFAULT NULL,
  `level_residual` enum('Rendah','Sedang','Tinggi','Sangat Tinggi') DEFAULT NULL,
  `action_plan` text,
  `pic` varchar(150) DEFAULT NULL,
  `keterangan_user` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rcsa_assessment`
--

INSERT INTO `rcsa_assessment` (`id`, `rcsa_master_id`, `jenis_risiko`, `unit_id`, `created_by`, `potensi_risiko`, `penyebab_risiko`, `status`, `dampak_inheren`, `frekuensi_inheren`, `nilai_inheren`, `level_inheren`, `pengendalian`, `dampak_residual`, `kemungkinan_residual`, `nilai_residual`, `level_residual`, `action_plan`, `pic`, `keterangan_user`, `created_at`, `updated_at`) VALUES
(216, 126, 'Risiko Kredit', 15, 32, 'TOLONG TEST BUAT INIMAH', 'wkwkwkw', 'draft', 5, 5, 25, 'Sangat Tinggi', 'pengendalian gini', 4, 2, 8, 'Sedang', 'AKSI', 'Pak Adis', NULL, '2025-12-30 22:08:19', '2025-12-30 22:47:03'),
(217, 127, 'Risiko Pasar', 15, 32, 'Kesalahan Input Data RCSA', 'testt123', 'reviewed', 2, 2, 4, 'Rendah', 'Pengendalian', 3, 3, 9, 'Sedang', 'Aksina', 'PIC', NULL, '2026-01-02 19:22:53', '2026-01-02 19:30:46'),
(218, 127, 'Risiko Likuiditas', 10, 26, 'Kesalahan Input Data RCSA', 'fasdsa', 'reviewed', 2, 2, 4, 'Rendah', 'pengendalian', 3, 2, 6, 'Sedang', 'aksi diwarnai dengan aksi', 'Mulyono ', NULL, '2026-01-03 19:01:33', '2026-01-03 19:18:15'),
(219, 129, 'Risiko Pasar', 10, 26, 'test TI', 'gsdfdfs', 'reviewed', 3, 3, 9, 'Sedang', 'Pengendailaa', 5, 5, 25, 'Sangat Tinggi', 'aksinya gitu', 'Bambang', NULL, '2026-01-03 19:19:48', '2026-01-03 19:20:36'),
(220, 130, 'Risiko Likuiditas', 10, 26, 'Sampoerna', 'dhfssdfs', 'reviewed', 5, 5, 25, 'Sangat Tinggi', 'gfsdgsdf', 4, 5, 20, 'Sangat Tinggi', 'aksina', 'geng oslo', NULL, '2026-01-03 19:47:43', '2026-01-03 19:48:42'),
(221, 135, 'Risiko Likuiditas', 10, 26, 'Serangan Cyber', 'fdkasfklajsdl', 'submitted', 4, 4, 16, 'Tinggi', 'fasdfasdf', 3, 4, 12, 'Tinggi', 'fdasfasdf', 'Zulkipli Hamdan', NULL, '2026-01-03 21:57:56', '2026-01-03 21:58:31'),
(222, 133, 'Risiko Likuiditas', 10, 26, 'test pagi subuh ini', NULL, 'draft', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-04 01:02:50', '2026-01-04 01:02:50'),
(223, 137, NULL, 10, 26, 'untuk ti', NULL, 'draft', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-04 01:03:24', '2026-01-04 01:03:24'),
(224, 126, 'Risiko Kredit', 15, 30, 'TOLONG TEST BUAT INIMAH', NULL, 'draft', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-10-31 14:43:53', '2026-10-31 14:43:53');

-- --------------------------------------------------------

--
-- Table structure for table `rcsa_master`
--

CREATE TABLE `rcsa_master` (
  `id` int NOT NULL,
  `rcsa_name` varchar(150) NOT NULL,
  `description` text,
  `created_by` int NOT NULL DEFAULT '25',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('draft','pending_approval','approved','rejected','published','archived') DEFAULT 'draft',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `submitted_by` int DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rcsa_master`
--

INSERT INTO `rcsa_master` (`id`, `rcsa_name`, `description`, `created_by`, `created_at`, `status`, `submitted_at`, `submitted_by`, `approved_at`, `approved_by`) VALUES
(126, 'TOLONG TEST BUAT INIMAH', NULL, 32, '2025-12-30 20:11:51', 'published', '2025-12-30 20:12:14', 32, '2025-12-30 22:42:45', 29),
(127, 'Kesalahan Input Data RCSA', NULL, 32, '2025-12-30 22:45:12', 'published', '2025-12-30 22:45:19', 32, '2025-12-30 22:45:35', 32),
(128, 'TEST TERBARYU', NULL, 26, '2026-01-03 19:01:14', 'published', '2026-01-03 19:01:17', 26, '2026-01-03 19:01:26', 26),
(129, 'test TI', NULL, 26, '2026-01-03 19:19:12', 'published', '2026-01-03 19:19:17', 26, '2026-01-03 19:19:26', 26),
(130, 'Sampoerna', NULL, 26, '2026-01-03 19:46:44', 'published', '2026-01-03 19:46:50', 26, '2026-01-03 19:47:12', 26),
(131, 'fasdfasdfa', NULL, 26, '2026-01-03 20:25:03', 'published', '2026-01-03 20:25:26', 26, '2026-01-03 20:25:33', 26),
(132, 'test123', NULL, 26, '2026-01-03 20:26:40', 'rejected', '2026-01-03 20:39:28', 26, NULL, NULL),
(133, 'test pagi subuh ini', 'test', 26, '2026-01-03 21:27:41', 'published', '2026-01-03 21:27:48', 26, '2026-01-04 00:58:49', 26),
(134, 'semuaa', NULL, 26, '2026-01-03 21:29:21', 'pending_approval', '2026-01-03 21:29:22', 26, NULL, NULL),
(135, 'Serangan Cyber', NULL, 26, '2026-01-03 21:57:19', 'published', '2026-01-03 21:57:20', 26, '2026-01-03 21:57:32', 26),
(136, 'wkwk', NULL, 26, '2026-01-03 23:41:42', 'pending_approval', '2026-01-23 02:17:20', 32, NULL, NULL),
(137, 'untuk ti', NULL, 26, '2026-01-04 01:02:33', 'published', '2026-01-04 01:02:36', 26, '2026-01-04 01:02:42', 26),
(138, 'risiko penggelapan', NULL, 32, '2026-01-12 06:37:00', 'published', '2026-01-12 06:37:10', 32, '2026-01-12 06:37:53', 32),
(139, 'test2', NULL, 32, '2026-01-23 03:04:03', 'pending_approval', '2026-01-23 03:06:23', 32, NULL, NULL),
(140, 'fdasdfsaf', NULL, 32, '2026-01-23 03:06:58', 'draft', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rcsa_master_approvals`
--

CREATE TABLE `rcsa_master_approvals` (
  `id` int NOT NULL,
  `rcsa_master_id` int NOT NULL,
  `step_order` int NOT NULL,
  `role_id` int DEFAULT NULL,
  `approver_user_id` int DEFAULT NULL,
  `reviewer_id` int DEFAULT NULL,
  `decision` enum('pending','approved','rejected') DEFAULT 'pending',
  `note` text,
  `decided_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rcsa_master_approvals`
--

INSERT INTO `rcsa_master_approvals` (`id`, `rcsa_master_id`, `step_order`, `role_id`, `approver_user_id`, `reviewer_id`, `decision`, `note`, `decided_at`, `created_at`) VALUES
(3, 126, 1, 3, 29, 29, 'approved', 'aa', '2025-12-30 22:42:45', '2025-12-30 20:12:14'),
(7, 127, 1, NULL, 32, 32, 'approved', 'nasi', '2025-12-30 22:45:35', '2025-12-30 22:45:19'),
(8, 128, 1, NULL, 26, 26, 'approved', 'silakan', '2026-01-03 19:01:26', '2026-01-03 19:01:17'),
(9, 129, 1, NULL, 26, 26, 'approved', 'silakan', '2026-01-03 19:19:26', '2026-01-03 19:19:17'),
(10, 130, 1, NULL, 26, 26, 'approved', 'mantapss', '2026-01-03 19:47:12', '2026-01-03 19:46:50'),
(12, 131, 1, NULL, 26, 26, 'approved', 'das', '2026-01-03 20:25:33', '2026-01-03 20:25:26'),
(15, 132, 1, NULL, 26, 26, 'rejected', 'DFSA', '2026-01-03 20:39:32', '2026-01-03 20:39:28'),
(16, 133, 1, NULL, 26, 26, 'approved', 's', '2026-01-04 00:58:49', '2026-01-03 21:27:48'),
(17, 134, 1, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-03 21:29:22'),
(18, 135, 1, NULL, 26, 26, 'approved', 'silakan', '2026-01-03 21:57:32', '2026-01-03 21:57:20'),
(19, 137, 1, NULL, 26, 26, 'approved', 'a', '2026-01-04 01:02:42', '2026-01-04 01:02:36'),
(20, 138, 1, NULL, 32, 32, 'approved', 'silakan', '2026-01-12 06:37:53', '2026-01-12 06:37:10'),
(21, 136, 1, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-23 02:17:20'),
(22, 139, 1, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-23 03:06:23');

-- --------------------------------------------------------

--
-- Table structure for table `rcsa_master_units`
--

CREATE TABLE `rcsa_master_units` (
  `id` int NOT NULL,
  `rcsa_master_id` int NOT NULL,
  `unit_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `assigned_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rcsa_master_units`
--

INSERT INTO `rcsa_master_units` (`id`, `rcsa_master_id`, `unit_id`, `is_active`, `assigned_at`) VALUES
(107, 126, 15, 1, '2025-12-30 22:42:49'),
(138, 127, 15, 1, '2025-12-30 22:45:39'),
(139, 127, 10, 1, '2025-12-30 22:45:39'),
(140, 128, 15, 1, '2026-01-03 19:18:27'),
(141, 129, 10, 1, '2026-01-03 19:19:44'),
(142, 130, 8, 1, '2026-01-03 19:47:37'),
(143, 130, 9, 1, '2026-01-03 19:47:37'),
(144, 130, 15, 1, '2026-01-03 19:47:37'),
(145, 130, 11, 1, '2026-01-03 19:47:37'),
(146, 130, 6, 1, '2026-01-03 19:47:37'),
(147, 130, 14, 1, '2026-01-03 19:47:37'),
(148, 130, 12, 1, '2026-01-03 19:47:37'),
(149, 130, 18, 1, '2026-01-03 19:47:37'),
(150, 130, 5, 1, '2026-01-03 19:47:37'),
(151, 130, 10, 1, '2026-01-03 19:47:37'),
(152, 130, 3, 1, '2026-01-03 19:47:37'),
(153, 131, 1, 1, '2026-01-03 20:25:40'),
(154, 132, 10, 0, NULL),
(155, 133, 15, 1, '2026-01-04 00:58:57'),
(156, 133, 10, 1, '2026-01-04 00:58:57'),
(157, 133, 3, 1, '2026-01-04 00:58:57'),
(158, 134, 1, 0, NULL),
(159, 134, 22, 0, NULL),
(160, 134, 19, 0, NULL),
(161, 134, 20, 0, NULL),
(162, 134, 17, 0, NULL),
(163, 134, 21, 0, NULL),
(164, 134, 2, 0, NULL),
(165, 134, 16, 0, NULL),
(166, 134, 7, 0, NULL),
(167, 134, 8, 0, NULL),
(168, 134, 9, 0, NULL),
(169, 134, 15, 0, NULL),
(170, 134, 11, 0, NULL),
(171, 134, 6, 0, NULL),
(172, 134, 14, 0, NULL),
(173, 134, 18, 0, NULL),
(174, 134, 12, 0, NULL),
(175, 134, 5, 0, NULL),
(176, 134, 4, 0, NULL),
(177, 134, 13, 0, NULL),
(178, 134, 3, 0, NULL),
(179, 134, 10, 0, NULL),
(180, 134, 26, 0, NULL),
(181, 134, 33, 0, NULL),
(182, 134, 36, 0, NULL),
(183, 134, 31, 0, NULL),
(184, 134, 34, 0, NULL),
(185, 134, 35, 0, NULL),
(186, 134, 40, 0, NULL),
(187, 134, 24, 0, NULL),
(188, 134, 32, 0, NULL),
(189, 134, 29, 0, NULL),
(190, 134, 27, 0, NULL),
(191, 134, 39, 0, NULL),
(192, 134, 25, 0, NULL),
(193, 134, 30, 0, NULL),
(194, 134, 38, 0, NULL),
(195, 134, 37, 0, NULL),
(196, 134, 28, 0, NULL),
(197, 134, 23, 0, NULL),
(198, 135, 10, 1, '2026-01-03 21:57:47'),
(199, 136, 22, 0, NULL),
(200, 137, 10, 1, '2026-01-04 01:02:44'),
(201, 138, 15, 1, '2026-01-12 06:38:07'),
(202, 139, 15, 0, NULL),
(203, 140, 20, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rcsa_review_notes`
--

CREATE TABLE `rcsa_review_notes` (
  `id` int NOT NULL,
  `assessment_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `note` text NOT NULL,
  `decision` enum('approved','rejected') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rcsa_review_notes`
--

INSERT INTO `rcsa_review_notes` (`id`, `assessment_id`, `reviewer_id`, `note`, `decision`, `created_at`) VALUES
(4, 217, 32, 'sudah pas', 'approved', '2026-01-02 19:30:46'),
(5, 218, 26, 'mantap', 'approved', '2026-01-03 19:18:15'),
(6, 219, 26, 'no make sense', 'rejected', '2026-01-03 19:20:36'),
(7, 220, 26, 'tidak seperti temuan audit', 'rejected', '2026-01-03 19:48:42');

-- --------------------------------------------------------

--
-- Table structure for table `risks`
--

CREATE TABLE `risks` (
  `id` int NOT NULL,
  `kategori_risiko` varchar(100) NOT NULL,
  `jenis_risiko` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `skenario_risiko` text,
  `root_cause` text,
  `dampak` text,
  `dampak_keuangan` int DEFAULT NULL,
  `tingkat_dampak_keuangan` varchar(50) DEFAULT NULL,
  `dampak_operasional` int DEFAULT NULL,
  `tingkat_dampak_operasional` varchar(50) DEFAULT NULL,
  `dampak_reputasi` int DEFAULT NULL,
  `tingkat_dampak_reputasi` varchar(50) DEFAULT NULL,
  `dampak_regulasi` int DEFAULT NULL,
  `tingkat_dampak_regulasi` varchar(50) DEFAULT NULL,
  `skor_kemungkinan` int DEFAULT NULL,
  `tingkat_kemungkinan` varchar(50) DEFAULT NULL,
  `nilai_risiko` int DEFAULT NULL,
  `tingkat_risiko` varchar(50) DEFAULT NULL,
  `rencana_penanganan` text,
  `deskripsi_rencana_penanganan` text,
  `risiko_residual` varchar(100) DEFAULT NULL,
  `kriteria_penerimaan_risiko` text,
  `pemilik_risiko` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('draft','final','reviewed','approved') DEFAULT 'draft',
  `last_updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `risks`
--

INSERT INTO `risks` (`id`, `kategori_risiko`, `jenis_risiko`, `skenario_risiko`, `root_cause`, `dampak`, `dampak_keuangan`, `tingkat_dampak_keuangan`, `dampak_operasional`, `tingkat_dampak_operasional`, `dampak_reputasi`, `tingkat_dampak_reputasi`, `dampak_regulasi`, `tingkat_dampak_regulasi`, `skor_kemungkinan`, `tingkat_kemungkinan`, `nilai_risiko`, `tingkat_risiko`, `rencana_penanganan`, `deskripsi_rencana_penanganan`, `risiko_residual`, `kriteria_penerimaan_risiko`, `pemilik_risiko`, `created_at`, `updated_at`, `status`, `last_updated_by`) VALUES
(1, 'Manajemen TI - Tata Kelola & PengawasanManajemen (1.1, 1.2)', 'Risiko Operasional', 'Kurangnya komitmen atau pengawasan aktif Direksi/Dewan Komisaris terhadap tata kelola dan risiko TI.', 'Kurangnya penyelarasan strategi dan/atau komitmen yang lemah.', 'Penerapan manajemen risiko TI tidak efektif, keputusan strategis TI tidak tepat, potensi kerugian tidak terkendali.', 3, 'sedang', 3, 'sedang', 3, 'sedang', 3, 'sedang', 3, 'kadang terjadi', 9, 'menengah', 'mitigasi', 'Penetapan wewenang & tanggung jawab Direksi/Dewan Komisaris yang jelas (Pasal 5 & 6 POJK MRTI); Pelaporan rutin kinerja & risiko TI kepada Direksi/Dewan Komisaris; Evaluasi berkala oleh Dewan Komisaris terhadap kebijakan & pelaksanaan manajemen risiko TI.', 'rendah', 'menengah', 26, '2025-09-06 22:09:57', '2025-09-15 07:58:42', 'draft', NULL),
(57, 'Test 123', 'Risiko Likuiditas', 'tesst', 'fsafdsa', 'dsaf', 3, 'Sedang', 2, 'Sedang', 3, 'Sedang', 3, 'Sedang', 3, 'Sedang', 3, 'Medium', 'Mitigasi', 'sda', 'Tinggi', 'fdsfsda', 26, '2025-09-21 21:32:04', '2025-10-23 09:21:55', 'draft', NULL),
(58, 'fskjks', 'Risiko Pasar', 'asdf', 'fsafda', 'fsdafsa', 1, 'Sedang', 2, 'Rendah', 3, 'Sedang', 3, 'Sedang', 3, 'Sedang', 47, 'High', 'Transfer', 'dfkjksjf', 'Menengah', 'sfkkdsfs', 26, '2025-09-25 09:17:40', '2025-10-23 09:20:07', 'draft', NULL),
(59, 'Sistem Bank', 'Risiko Pasar', 'aksess yang kurang berkenan', 'lambatnya aplikasi yang dipakai', 'terhambatnya aplikasi operasional', 2, 'Sedang', 3, 'Sedang', 1, 'Sedang', 3, 'Sedang', 1, 'Sedang', 3, 'Medium', 'Mitigasi', 'audit internal tambahan', 'Menengah', 'diterima oleh manrisk', 26, '2025-09-30 09:20:37', '2025-10-23 09:20:05', 'draft', NULL),
(60, 'Operasional', 'Risiko Operasional', 'penyalahgunaan', 'lemahnya kontrol', 'kerugian fungsionalitas', 1, 'Rendah', 1, 'Sedang', 2, 'Sedang', 2, 'Sedang', 2, 'Sedang', 3, 'Medium', 'Mitigasi', 'dfsafdsa', 'Menengah', 'fsad', 27, '2025-10-08 16:19:52', '2025-12-02 07:15:50', 'final', NULL),
(64, 'tesyy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 26, '2025-11-30 17:55:17', '2025-11-30 17:55:17', 'draft', 27),
(65, 'test2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-30 18:07:23', '2025-11-30 18:07:23', 'draft', 27),
(66, 'test456', 'Risiko Operasional', 'skenarioaaa', 'akarbaya', 'fdaf', 2, NULL, 2, NULL, 2, NULL, 2, NULL, 4, NULL, NULL, NULL, 'fasdfsafdsafd', 'fadsfas', 'tingkat', 'kriteria', 27, '2025-11-30 18:11:20', '2025-12-02 07:18:38', 'draft', 27),
(67, 'fsfas', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 26, '2025-11-30 18:18:06', '2025-11-30 18:18:06', 'draft', 27),
(68, 'Manrisk test 123', 'Risiko Pasar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 27, '2025-12-02 07:12:57', '2025-12-26 21:41:04', 'draft', 27);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES
(1, 'Super User', 'Akses penuh dan manajemen user (provisioning)'),
(2, 'Executive Reviewer', 'Bisa membaca, melihat, dan approve data'),
(3, 'Supervisor', 'Bisa membaca, melihat, dan approve data'),
(4, 'Staff', 'Bisa input, update, dan hapus data miliknya'),
(5, 'Administrator', 'Akses administrasi sistem'),
(6, 'Unit Staff', 'PIC unit kerja: input & update RCSA assessment'),
(7, 'Unit Supervisor', 'Supervisor unit kerja: monitoring/validasi internal');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int NOT NULL,
  `role_id` int NOT NULL,
  `can_create` tinyint(1) DEFAULT '0',
  `can_read` tinyint(1) DEFAULT '1',
  `can_view` tinyint(1) DEFAULT '1',
  `can_update` tinyint(1) DEFAULT '0',
  `can_approve` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  `can_provision` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `can_create`, `can_read`, `can_view`, `can_update`, `can_approve`, `can_delete`, `can_provision`) VALUES
(1, 1, 1, 1, 1, 1, 1, 1, 1),
(2, 2, 0, 1, 1, 0, 1, 0, 1),
(3, 3, 1, 1, 1, 1, 1, 0, 1),
(4, 4, 1, 1, 1, 1, 0, 1, 0),
(5, 5, 1, 1, 1, 1, 1, 1, 1),
(6, 6, 1, 1, 1, 1, 0, 0, 0),
(7, 7, 0, 1, 1, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int NOT NULL,
  `unit_name` varchar(150) NOT NULL,
  `unit_type` enum('Kantor Pusat','Divisi','Cabang','KCP') NOT NULL,
  `parent_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `unit_name`, `unit_type`, `parent_id`) VALUES
(1, 'Kantor Pusat', 'Kantor Pusat', NULL),
(2, 'Divisi Audit Internal', 'Divisi', 1),
(3, 'Divisi Sumber Daya Insani (SDI)', 'Divisi', 1),
(4, 'Divisi Perencanaan Strategis', 'Divisi', 1),
(5, 'Divisi Penyelamatan & Penyelesaian Pembiayaan (P3)', 'Divisi', 1),
(6, 'Divisi Pembiayaan Konsumer', 'Divisi', 1),
(7, 'Divisi Dana Jasa Ritel', 'Divisi', 1),
(8, 'Divisi Dana Korporasi dan Institusi (Insbank)', 'Divisi', 1),
(9, 'Divisi Kepatuhan', 'Divisi', 1),
(10, 'Divisi Teknologi Informasi', 'Divisi', 1),
(11, 'Divisi Operasional', 'Divisi', 1),
(12, 'Divisi Pengendalian Keuangan', 'Divisi', 1),
(13, 'Divisi Risiko Pembiayaan', 'Divisi', 1),
(14, 'Divisi Pembiayaan UMKM, Ritel, & Komersil', 'Divisi', 1),
(15, 'Divisi Manajemen Risiko', 'Divisi', 1),
(16, 'Divisi Bisnis Digital', 'Divisi', 1),
(17, 'Desk Sekretariat Perusahaan (Corsec)', 'Divisi', 1),
(18, 'Divisi Pengembangan Produk & Prosedur (Sysdur)', 'Divisi', 1),
(19, 'Desk Administrasi Pembiayaan & Bisnis Legal (APBL)', 'Divisi', 1),
(20, 'Desk Legal', 'Divisi', 1),
(21, 'Desk Treasury', 'Divisi', 1),
(22, 'BANDUNG PELAJAR PEJUANG', 'Cabang', NULL),
(23, 'TASIKMALAYA', 'Cabang', NULL),
(24, 'KCP GARUT', 'KCP', 22),
(25, 'KCP SOREANG', 'KCP', 22),
(26, 'KCP ARCAMANIK', 'KCP', 22),
(27, 'KCP RANCAEKEK', 'KCP', 22),
(28, 'KK UIN SUNAN GUNUNG DJATI', 'KCP', 22),
(29, 'KCP MOH. TOHA', 'KCP', 22),
(30, 'KCP SUMEDANG', 'KCP', 22),
(31, 'KCP BOJONGSOANG', 'KCP', 22),
(32, 'KCP MAJALAYA', 'KCP', 22),
(33, 'KCP BANJAR', 'KCP', 23),
(34, 'KCP CIAMIS', 'KCP', 23),
(35, 'KCP CIAWI', 'KCP', 23),
(36, 'KCP BANTAR KALONG', 'KCP', 23),
(37, 'KK JASA KARTINI', 'KCP', 23),
(38, 'KCP Tipe B Universitas Siliwangi', 'KCP', 23),
(39, 'KCP SINGAPARNA', 'KCP', 23),
(40, 'KCP CIKURUBUK', 'KCP', 23);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `unit_id` int DEFAULT NULL,
  `role_id` int NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password`, `unit_id`, `role_id`, `status`, `created_at`, `updated_at`) VALUES
(26, 'S20S19', 'Moch Syahrizal Fauzan', 'syahrizal@gmail.com', '$2b$10$xSYAPCfmkj3ZIxu2p252OepgY8XjiB8oqKk5ytpVU78cSBJOv.PyW', 10, 1, 'active', '2025-09-09 09:13:04', '2025-09-17 10:02:25'),
(27, 'S10S11', 'Staf Manrisk', NULL, '$2b$10$F174E3xFv64Qxe/nR8PxIuNc0cFP3i2NCHCBbKFbkDbg1i2vnvzHy', 15, 4, 'active', '2025-10-05 23:05:11', '2025-10-05 23:05:11'),
(28, 'S10S12', 'Staf Manrisk2', NULL, '$2b$10$kyHI2BRRCJY/lmbYA31R.e/lDLEstSoUjsLivK926iHG8FbSdF5du', 15, 4, 'active', '2025-10-05 23:15:40', '2025-10-05 23:15:40'),
(29, 'S01S02', 'Bos Besar', NULL, '$2b$10$Fx.Bvnu.2L0pZ3YHxfzMquXWhEzTspp3.cqNm12IpznTf1xaZWzr2', 15, 2, 'active', '2025-12-29 21:38:50', '2025-12-29 21:38:50'),
(30, 'S00S01', 'Senior Manager MANRISK', NULL, '$2b$10$mIKeRltBxTJUb900SaZ85uqIWvDSDKASQS6aasvJ6u7XTYEEmTNQ.', 15, 2, 'active', '2025-12-30 19:39:09', '2025-12-30 19:39:09'),
(31, 'U001', 'Staf Sumber Daya Insani', NULL, '$2b$10$hmhFkGYG29jLA2bbpPDxFOh3f6xuEVwvQSnYsaeQY84PL2ZdUtgDS', 3, 6, 'active', '2025-12-30 19:43:42', '2025-12-30 19:43:42'),
(32, 'S02S02', 'PEMIMPIN GRUP OPERASIONAL', NULL, '$2b$10$DIrCw3cJSlQ8b5m0wFIk6./zrUlHT/MqiBewOG/4jR81jsHVl5eri', 15, 3, 'active', '2025-12-30 20:06:02', '2025-12-30 20:06:02');

-- --------------------------------------------------------

--
-- Table structure for table `user_logins`
--

CREATE TABLE `user_logins` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `login_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `logout_time` datetime DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text,
  `success` tinyint(1) DEFAULT '1',
  `role_name` varchar(100) DEFAULT NULL,
  `unit_name` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_logins`
--

INSERT INTO `user_logins` (`id`, `user_id`, `login_time`, `logout_time`, `ip_address`, `user_agent`, `success`, `role_name`, `unit_name`) VALUES
(3, 26, '2025-10-05 02:20:03', '2025-10-05 02:20:22', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(4, 26, '2025-10-05 02:20:50', '2025-10-05 02:20:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(6, 26, '2025-10-05 22:35:54', '2025-10-05 23:21:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(7, 26, '2025-10-05 23:21:58', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(8, 26, '2025-10-06 00:22:50', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(9, 26, '2025-10-06 04:31:32', '2025-10-06 05:15:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(10, 26, '2025-10-06 05:38:08', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(11, 27, '2025-10-07 17:11:42', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(12, 27, '2025-10-07 18:06:29', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(13, 27, '2025-10-08 17:53:28', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(14, 27, '2025-10-08 18:17:18', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(15, 26, '2025-10-09 02:57:18', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(16, 26, '2025-10-09 20:28:42', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(17, 26, '2025-10-09 22:09:51', '2025-10-09 22:20:00', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(18, 26, '2025-10-09 22:20:11', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(19, 26, '2025-10-09 22:20:30', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(20, 26, '2025-10-09 22:27:13', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(21, 26, '2025-10-09 23:06:15', '2025-10-09 23:06:18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(22, 26, '2025-10-09 23:06:21', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(23, 26, '2025-10-18 19:51:18', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(24, 26, '2025-10-18 21:36:45', '2025-10-18 22:06:38', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(25, 27, '2025-10-18 22:06:52', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 0, 'Staff', 'Divisi Manajemen Risiko'),
(26, 27, '2025-10-18 22:07:03', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(27, 27, '2025-10-19 00:55:06', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(28, 27, '2025-10-19 20:47:09', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(29, 27, '2025-10-20 13:01:23', '2025-10-20 13:46:20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(30, 27, '2025-10-20 13:46:22', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(31, 27, '2025-10-20 15:46:47', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(32, 27, '2025-10-20 17:42:02', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(33, 27, '2025-10-20 19:04:08', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(34, 27, '2025-10-20 20:05:15', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(35, 27, '2025-10-20 21:10:38', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(36, 27, '2025-10-21 18:54:22', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(37, 27, '2025-10-22 21:40:03', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(38, 27, '2025-10-22 22:40:37', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(39, 27, '2025-10-22 23:41:39', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(40, 27, '2025-10-23 10:08:33', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(41, 27, '2025-10-23 11:12:23', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(42, 27, '2025-10-23 13:05:07', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(43, 27, '2025-10-23 14:06:53', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(44, 27, '2025-10-23 15:37:02', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(45, 27, '2025-10-23 16:44:31', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(46, 27, '2025-10-23 17:55:24', '2025-10-23 18:00:13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(47, 27, '2025-10-25 19:55:28', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(48, 27, '2025-10-30 16:47:18', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(49, 27, '2025-10-30 19:08:07', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(50, 27, '2025-11-05 17:54:30', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(51, 27, '2025-11-06 08:40:16', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(52, 27, '2025-11-06 11:12:21', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(53, 27, '2025-11-14 11:17:38', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(54, 27, '2025-11-17 18:03:34', '2025-11-17 18:04:21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(55, 27, '2025-11-17 18:04:28', '2025-11-17 18:16:06', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(56, 27, '2025-11-30 19:19:27', '2025-11-30 19:26:08', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(57, 27, '2025-11-30 20:33:10', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(58, 27, '2025-11-30 21:37:43', '2025-11-30 22:21:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(59, 27, '2025-11-30 22:21:07', '2025-11-30 22:32:21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(60, 27, '2025-11-30 23:37:02', '2025-12-01 00:14:13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(61, 27, '2025-12-01 00:14:36', '2025-12-01 00:44:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(62, 27, '2025-12-01 00:44:59', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(63, 27, '2025-12-01 02:02:15', '2025-12-01 02:04:29', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(64, 27, '2025-12-01 02:05:01', '2025-12-01 02:05:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(65, 26, '2025-12-01 02:06:43', '2025-12-01 02:07:34', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(66, 27, '2025-12-01 02:07:37', '2025-12-01 02:29:48', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(67, 27, '2025-12-02 14:01:46', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(68, 27, '2025-12-02 15:09:58', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(69, 27, '2025-12-27 03:33:09', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(70, 27, '2025-12-27 04:39:04', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(71, 27, '2025-12-28 02:38:18', '2025-12-28 02:59:27', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(72, 27, '2025-12-28 02:59:30', '2025-12-28 03:00:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(73, 27, '2025-12-28 03:00:05', '2025-12-28 03:00:24', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(74, 27, '2025-12-28 03:00:39', '2025-12-28 03:01:08', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(75, 27, '2025-12-28 03:01:11', '2025-12-28 03:02:01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(76, 27, '2025-12-28 03:02:09', '2025-12-28 03:04:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(77, 27, '2025-12-28 03:04:42', '2025-12-28 03:11:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(78, 27, '2025-12-28 03:12:05', '2025-12-28 03:31:20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(79, 27, '2025-12-28 03:45:45', '2025-12-28 03:56:32', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(80, 27, '2025-12-28 03:57:14', '2025-12-28 04:23:43', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(81, 27, '2025-12-28 04:31:38', '2025-12-28 04:31:49', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(82, 27, '2025-12-28 04:32:08', '2025-12-28 04:32:27', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(83, 26, '2025-12-28 04:32:50', '2025-12-28 04:33:52', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(84, 27, '2025-12-28 04:33:55', '2025-12-28 04:42:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(85, 26, '2025-12-28 04:42:20', '2025-12-28 04:42:31', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(86, 27, '2025-12-28 04:42:39', '2025-12-28 05:09:04', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(87, 27, '2025-12-28 05:09:48', '2025-12-28 05:34:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(88, 27, '2025-12-28 05:34:49', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(89, 27, '2025-12-28 05:48:42', '2025-12-28 05:48:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(90, 27, '2025-12-28 05:48:51', '2025-12-28 06:16:19', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(91, 27, '2025-12-28 06:16:21', '2025-12-28 06:16:42', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(92, 26, '2025-12-28 06:16:44', '2025-12-28 06:18:00', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(93, 27, '2025-12-28 06:18:03', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(94, 27, '2025-12-29 00:48:19', '2025-12-29 00:51:05', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(95, 27, '2025-12-29 00:52:25', '2025-12-29 01:00:24', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(96, 27, '2025-12-29 01:00:45', '2025-12-29 01:04:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(97, 27, '2025-12-29 01:05:12', '2025-12-29 01:30:54', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(98, 27, '2025-12-29 01:30:57', '2025-12-29 01:31:00', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(99, 26, '2025-12-29 01:31:03', '2025-12-29 01:31:23', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(100, 27, '2025-12-29 01:31:28', '2025-12-29 01:31:45', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(101, 26, '2025-12-29 01:31:47', '2025-12-29 01:32:55', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(102, 27, '2025-12-29 01:33:00', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(103, 27, '2025-12-29 23:04:59', '2025-12-29 23:05:32', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(104, 26, '2025-12-29 23:05:36', '2025-12-29 23:16:27', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(105, 26, '2025-12-29 23:16:31', '2025-12-29 23:16:35', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(106, 27, '2025-12-29 23:16:38', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(107, 27, '2025-12-30 01:16:28', '2025-12-30 01:16:50', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(108, 26, '2025-12-30 01:16:53', '2025-12-30 01:17:36', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(109, 27, '2025-12-30 01:47:02', '2025-12-30 01:48:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(110, 26, '2025-12-30 01:48:44', '2025-12-30 02:12:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(111, 27, '2025-12-30 02:12:07', '2025-12-30 02:13:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(112, 26, '2025-12-30 02:13:51', '2025-12-30 02:57:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(113, 27, '2025-12-30 02:57:44', '2025-12-30 02:57:57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(114, 26, '2025-12-30 02:58:00', '2025-12-30 02:58:35', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(115, 27, '2025-12-30 02:58:38', '2025-12-30 02:59:06', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(116, 26, '2025-12-30 02:59:09', '2025-12-30 03:52:53', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(117, 27, '2025-12-30 03:52:57', '2025-12-30 03:56:42', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(118, 26, '2025-12-30 03:56:45', '2025-12-30 04:04:49', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(119, 27, '2025-12-30 04:04:52', '2025-12-30 04:04:56', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(120, 26, '2025-12-30 04:04:59', '2025-12-30 04:15:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(121, 27, '2025-12-30 04:15:43', '2025-12-30 04:15:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(122, 26, '2025-12-30 04:15:54', '2025-12-30 04:32:22', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(123, 27, '2025-12-30 04:32:24', '2025-12-30 04:32:37', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(124, 26, '2025-12-30 04:32:39', '2025-12-30 04:32:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(125, 27, '2025-12-30 04:32:50', '2025-12-30 04:32:55', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(126, 26, '2025-12-30 04:32:58', '2025-12-30 04:39:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(127, 29, '2025-12-30 04:39:46', '2025-12-30 04:40:29', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(128, 26, '2025-12-30 04:40:33', '2025-12-30 05:02:44', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(129, 26, '2025-12-30 05:04:07', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(130, 26, '2025-12-30 06:11:18', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(131, 26, '2025-12-30 06:21:42', '2025-12-30 06:51:30', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(132, 29, '2025-12-30 06:51:36', '2025-12-30 06:51:45', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(133, 26, '2025-12-30 06:51:49', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(134, 26, '2025-12-30 08:19:41', '2025-12-30 08:20:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(135, 29, '2025-12-30 08:20:18', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(136, 29, '2025-12-31 02:09:13', '2025-12-31 02:09:20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(137, 26, '2025-12-31 02:09:24', '2025-12-31 02:11:26', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(138, 29, '2025-12-31 02:11:32', '2025-12-31 02:11:38', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(139, 26, '2025-12-31 02:11:42', '2025-12-31 02:17:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(140, 26, '2025-12-31 02:22:24', NULL, '::1', 'PostmanRuntime/7.48.0', 1, 'Super User', 'Divisi Teknologi Informasi'),
(141, 26, '2025-12-31 02:34:41', '2025-12-31 02:34:54', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(142, 29, '2025-12-31 02:34:58', '2025-12-31 02:36:56', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(143, 26, '2025-12-31 02:36:59', '2025-12-31 02:39:43', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(144, 30, '2025-12-31 02:39:47', '2025-12-31 02:41:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(145, 27, '2025-12-31 02:41:51', '2025-12-31 02:42:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(146, 26, '2025-12-31 02:42:06', '2025-12-31 02:44:34', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(147, 31, '2025-12-31 02:44:36', '2025-12-31 02:44:42', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Unit Staff', 'Divisi Sumber Daya Insani (SDI)'),
(148, 26, '2025-12-31 02:44:47', '2025-12-31 02:55:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(149, 29, '2025-12-31 02:55:34', '2025-12-31 02:57:56', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(150, 29, '2025-12-31 02:58:04', '2025-12-31 02:58:09', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(151, 30, '2025-12-31 02:58:17', '2025-12-31 03:06:09', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(152, 32, '2025-12-31 03:06:14', '2025-12-31 03:07:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(153, 30, '2025-12-31 03:07:55', '2025-12-31 03:09:24', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(154, 27, '2025-12-31 03:09:29', '2025-12-31 03:09:32', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(155, 31, '2025-12-31 03:09:35', '2025-12-31 03:11:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Unit Staff', 'Divisi Sumber Daya Insani (SDI)'),
(156, 32, '2025-12-31 03:11:22', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(157, 26, '2025-12-31 03:31:23', NULL, '::1', 'PostmanRuntime/7.48.0', 1, 'Super User', 'Divisi Teknologi Informasi'),
(158, 32, '2025-12-31 04:13:06', '2025-12-31 04:27:29', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(159, 26, '2025-12-31 04:27:34', '2025-12-31 04:37:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(160, 30, '2025-12-31 04:38:01', '2025-12-31 04:39:09', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(161, 29, '2025-12-31 04:39:13', '2025-12-31 04:39:21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(162, 26, '2025-12-31 04:39:25', '2025-12-31 04:46:57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(163, 30, '2025-12-31 04:47:01', '2025-12-31 04:59:57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(164, 26, '2025-12-31 04:47:33', NULL, '::1', 'PostmanRuntime/7.48.0', 1, 'Super User', 'Divisi Teknologi Informasi'),
(165, 32, '2025-12-31 05:00:02', '2025-12-31 05:15:09', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(166, 27, '2025-12-31 05:15:17', '2025-12-31 05:15:36', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(167, 26, '2025-12-31 05:15:41', '2025-12-31 05:15:49', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(168, 29, '2025-12-31 05:15:53', '2025-12-31 05:44:04', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(169, 27, '2025-12-31 05:44:08', '2025-12-31 05:44:11', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(170, 29, '2025-12-31 05:44:17', '2025-12-31 05:44:30', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(171, 27, '2025-12-31 05:44:43', '2025-12-31 05:44:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Staff', 'Divisi Manajemen Risiko'),
(172, 32, '2025-12-31 05:44:50', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(173, 32, '2026-01-03 02:21:10', '2026-01-03 03:17:07', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(174, 32, '2026-01-03 03:17:48', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(175, 26, '2026-01-03 03:20:11', NULL, '::1', 'PostmanRuntime/7.51.0', 1, 'Super User', 'Divisi Teknologi Informasi'),
(176, 26, '2026-01-04 01:37:00', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 0, 'Super User', 'Divisi Teknologi Informasi'),
(177, 26, '2026-01-04 01:37:07', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(178, 26, '2026-01-04 01:47:39', NULL, '::1', 'PostmanRuntime/7.51.0', 1, 'Super User', 'Divisi Teknologi Informasi'),
(179, 26, '2026-01-04 02:37:49', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(180, 26, '2026-01-04 03:39:21', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(181, 26, '2026-01-04 04:40:09', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(182, 26, '2026-01-04 06:27:46', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(183, 26, '2026-01-04 07:04:17', NULL, '::1', 'PostmanRuntime/7.51.0', 1, 'Super User', 'Divisi Teknologi Informasi'),
(184, 26, '2026-01-04 07:26:32', NULL, '::1', 'PostmanRuntime/7.51.0', 1, 'Super User', 'Divisi Teknologi Informasi'),
(185, 26, '2026-01-04 07:38:18', '2026-01-04 07:56:28', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(186, 26, '2026-01-04 07:57:03', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(187, 26, '2026-01-06 17:51:10', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Super User', 'Divisi Teknologi Informasi'),
(188, 32, '2026-01-12 13:36:03', '2026-01-12 13:39:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(189, 32, '2026-01-22 16:43:43', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(190, 32, '2026-01-23 09:16:36', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(191, 32, '2026-01-23 11:34:03', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(192, 32, '2026-01-23 12:34:09', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1, 'Supervisor', 'Divisi Manajemen Risiko'),
(193, 32, '2026-10-31 21:42:04', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', 0, 'Supervisor', 'Divisi Manajemen Risiko'),
(194, 30, '2026-10-31 21:42:11', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko'),
(195, 30, '2026-11-02 13:15:08', '2026-11-02 13:15:26', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', 1, 'Executive Reviewer', 'Divisi Manajemen Risiko');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rcsa_assessment`
--
ALTER TABLE `rcsa_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rcsa_master_id` (`rcsa_master_id`),
  ADD KEY `unit_id` (`unit_id`),
  ADD KEY `idx_assessment_created_status` (`created_by`,`status`,`updated_at`);

--
-- Indexes for table `rcsa_master`
--
ALTER TABLE `rcsa_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `fk_rcsa_master_submitted_by` (`submitted_by`),
  ADD KEY `fk_rcsa_master_approved_by` (`approved_by`);

--
-- Indexes for table `rcsa_master_approvals`
--
ALTER TABLE `rcsa_master_approvals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rcsa_master_id` (`rcsa_master_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `fk_rcsa_approver_user` (`approver_user_id`),
  ADD KEY `idx_rcsa_approvals_pending` (`decision`,`approver_user_id`);

--
-- Indexes for table `rcsa_master_units`
--
ALTER TABLE `rcsa_master_units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rcsa_master_id` (`rcsa_master_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indexes for table `rcsa_review_notes`
--
ALTER TABLE `rcsa_review_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `idx_review_notes_assessment_created` (`assessment_id`,`created_at` DESC);

--
-- Indexes for table `risks`
--
ALTER TABLE `risks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemilik_risiko` (`pemilik_risiko`),
  ADD KEY `fk_risks_last_updated_by` (`last_updated_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `fk_users_unit` (`unit_id`);

--
-- Indexes for table `user_logins`
--
ALTER TABLE `user_logins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rcsa_assessment`
--
ALTER TABLE `rcsa_assessment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT for table `rcsa_master`
--
ALTER TABLE `rcsa_master`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `rcsa_master_approvals`
--
ALTER TABLE `rcsa_master_approvals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `rcsa_master_units`
--
ALTER TABLE `rcsa_master_units`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `rcsa_review_notes`
--
ALTER TABLE `rcsa_review_notes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `risks`
--
ALTER TABLE `risks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `user_logins`
--
ALTER TABLE `user_logins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rcsa_assessment`
--
ALTER TABLE `rcsa_assessment`
  ADD CONSTRAINT `rcsa_assessment_ibfk_1` FOREIGN KEY (`rcsa_master_id`) REFERENCES `rcsa_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rcsa_assessment_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rcsa_assessment_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rcsa_master`
--
ALTER TABLE `rcsa_master`
  ADD CONSTRAINT `fk_rcsa_master_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rcsa_master_submitted_by` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rcsa_master_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rcsa_master_approvals`
--
ALTER TABLE `rcsa_master_approvals`
  ADD CONSTRAINT `fk_rcsa_approver_user` FOREIGN KEY (`approver_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rcsa_master_approvals_ibfk_1` FOREIGN KEY (`rcsa_master_id`) REFERENCES `rcsa_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rcsa_master_approvals_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rcsa_master_approvals_ibfk_3` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `rcsa_master_units`
--
ALTER TABLE `rcsa_master_units`
  ADD CONSTRAINT `rcsa_master_units_ibfk_1` FOREIGN KEY (`rcsa_master_id`) REFERENCES `rcsa_master` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rcsa_master_units_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rcsa_review_notes`
--
ALTER TABLE `rcsa_review_notes`
  ADD CONSTRAINT `rcsa_review_notes_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `rcsa_assessment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rcsa_review_notes_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `risks`
--
ALTER TABLE `risks`
  ADD CONSTRAINT `fk_risks_last_updated_by` FOREIGN KEY (`last_updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `risks_ibfk_1` FOREIGN KEY (`pemilik_risiko`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `units_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `units` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `user_logins`
--
ALTER TABLE `user_logins`
  ADD CONSTRAINT `user_logins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
