/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 100424
 Source Host           : localhost:3306
 Source Schema         : whois_logs

 Target Server Type    : MySQL
 Target Server Version : 100424
 File Encoding         : 65001

 Date: 17/10/2025 18:31:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for whois_lookups
-- ----------------------------
DROP TABLE IF EXISTS `whois_lookups`;
CREATE TABLE `whois_lookups`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `domain` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `info_type` enum('domain','contact') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `http_status` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  `registrar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0),
  `new_column` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_domain`(`domain`) USING BTREE,
  INDEX `idx_created_at`(`created_at`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of whois_lookups
-- ----------------------------
INSERT INTO `whois_lookups` VALUES (1, 'test.com', 'domain', 200, 1, 'Test Registrar', '2025-10-17 16:28:41', NULL);
INSERT INTO `whois_lookups` VALUES (2, 'google.com', 'domain', 200, 1, 'MarkMonitor, Inc.', '2025-10-17 16:33:09', NULL);
INSERT INTO `whois_lookups` VALUES (3, 'google.com', 'contact', 200, 1, NULL, '2025-10-17 16:33:14', NULL);
INSERT INTO `whois_lookups` VALUES (4, 'amazon.com', 'domain', 200, 1, 'MarkMonitor, Inc.', '2025-10-17 16:39:03', NULL);
INSERT INTO `whois_lookups` VALUES (5, 'amazon.com', 'contact', 200, 1, NULL, '2025-10-17 16:39:14', NULL);
INSERT INTO `whois_lookups` VALUES (6, 'amazon.com', 'domain', 200, 1, 'MarkMonitor, Inc.', '2025-10-17 16:41:17', NULL);
INSERT INTO `whois_lookups` VALUES (7, 'amazon.com', 'contact', 200, 1, NULL, '2025-10-17 16:41:23', NULL);
INSERT INTO `whois_lookups` VALUES (8, 'google.com', 'contact', 200, 1, NULL, '2025-10-17 16:41:29', NULL);
INSERT INTO `whois_lookups` VALUES (9, 'google.com', 'domain', 200, 1, 'MarkMonitor, Inc.', '2025-10-17 16:41:32', NULL);
INSERT INTO `whois_lookups` VALUES (10, 'amazon.com', 'domain', 200, 1, 'MarkMonitor, Inc.', '2025-10-17 18:27:47', NULL);
INSERT INTO `whois_lookups` VALUES (11, 'amazon.com', 'contact', 200, 1, NULL, '2025-10-17 18:28:02', NULL);
INSERT INTO `whois_lookups` VALUES (12, 'amazon.com', 'domain', 200, 1, 'MarkMonitor, Inc.', '2025-10-17 18:31:04', NULL);
INSERT INTO `whois_lookups` VALUES (13, 'amazon.com', 'contact', 200, 1, NULL, '2025-10-17 18:31:17', NULL);
INSERT INTO `whois_lookups` VALUES (14, '', '', 500, 0, NULL, '2025-10-17 18:31:26', NULL);
INSERT INTO `whois_lookups` VALUES (15, 'facebook.com', 'domain', 200, 1, 'RegistrarSafe, LLC', '2025-10-17 18:31:30', NULL);

SET FOREIGN_KEY_CHECKS = 1;
