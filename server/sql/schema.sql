-- MySQL Schema for KhangCoffee Database

CREATE DATABASE IF NOT EXISTS khangcoffee DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE khangcoffee;

-- 1. Categories Table
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS tables;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  is_featured TINYINT(1) DEFAULT 0,
  is_available TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tables Management
CREATE TABLE tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number VARCHAR(20) NOT NULL UNIQUE,
  seating_capacity INT DEFAULT 4,
  status ENUM('available', 'occupied', 'reserved') DEFAULT 'available',
  qr_code_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Orders Table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(30) NOT NULL UNIQUE,
  order_type ENUM('table', 'delivery') NOT NULL DEFAULT 'delivery',
  table_number VARCHAR(20) NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_address TEXT NULL,
  note TEXT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'transfer', 'qr') DEFAULT 'cash',
  status ENUM('pending', 'preparing', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Order Items Table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  options VARCHAR(255) NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data

INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES
(1, 'Cà Phê Phin Truyền Thống', 'ca-phe-phin', 'Đậm đà hương vị cà phê Việt Nam truyền thống', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', 1),
(2, 'Espresso & Ý', 'espresso-y', 'Hương vị cà phê Ý nguyên bản tinh tế', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop', 2),
(3, 'Trà & Trà Sữa Premium', 'tra-tra-sua', 'Trà tươi thơm lừng thanh mát kết hợp trái cây và sữa', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop', 3),
(4, 'Bánh Ngọt Editorial', 'banh-ngot', 'Bánh ngọt tươi làm mới mỗi ngày', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop', 4);

INSERT INTO products (category_id, name, slug, description, price, image_url, is_featured, is_available) VALUES
(1, 'Cà Phê Sữa Đá Khang', 'ca-phe-sua-da-khang', 'Cà phê phin nguyên chất kết hợp sữa đặc béo ngậy chuẩn vị Sài Gòn', 39000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', 1, 1),
(1, 'Cà Phê Đen Đô Mộc', 'ca-phe-den-do-moc', 'Cà phê Robusta Đắk Lắk đậm vị đắng thanh quyến rũ', 35000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop', 0, 1),
(1, 'Bạc Xỉu Sài Gòn Premium', 'bac-xiu-sai-gon', 'Nhiều sữa ít cà phê, béo mịn dịu ngọt thơm nồng', 42000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop', 1, 1),
(2, 'Flat White Roasted', 'flat-white-roasted', 'Espresso đôi hòa quyện cùng lớp sữa mịn mượt chuẩn phong cách Úc', 55000, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop', 1, 1),
(2, 'Cappuccino Vanilla', 'cappuccino-vanilla', 'Espresso đậm đà phủ bọt sữa mịn màng thoảng hương vani', 52000, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop', 0, 1),
(2, 'Salted Cream Cold Brew', 'salted-cream-cold-brew', 'Cà phê ủ lạnh 16 tiếng phủ kem muối biển béo mặn độc đáo', 58000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop', 1, 1),
(3, 'Trà Đào Cam Sả Tươi', 'tra-dao-cam-sa', 'Trà đen thanh mát kết hợp đào miếng giòn ngọt, cam tươi và sả thơm', 49000, '/images/tra-dao-cam-sa.png', 1, 1),
(3, 'Trà Oolong Vải Hoa Lài', 'tra-oolong-vai', 'Trà Oolong thượng hạng kết hợp hương hoa lài dịu nhẹ và quả vải tươi', 52000, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', 0, 1),
(4, 'Croissant Bơ Pháp', 'croissant-bo-phap', 'Bánh sừng bò ngàn lớp thơm lừng mùi bơ Pháp cao cấp', 38000, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop', 1, 1),
(4, 'Tiramisu Cà Phê Espresso', 'tiramisu-espresso', 'Bánh Tiramisu Ý truyền thống mềm mịn đẫm vị cà phê đậm đà', 45000, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop', 0, 1);

INSERT INTO tables (table_number, seating_capacity, status) VALUES
('A1', 2, 'available'),
('A2', 2, 'available'),
('A3', 4, 'occupied'),
('A4', 4, 'available'),
('A5', 6, 'reserved'),
('B1', 2, 'available'),
('B2', 4, 'available'),
('B3', 4, 'available');

INSERT INTO orders (order_code, order_type, table_number, customer_name, customer_phone, delivery_address, total_amount, payment_method, status) VALUES
('KC-1001', 'table', 'A1', 'Anh Hoàng', '0901234567', NULL, 81000, 'cash', 'preparing'),
('KC-1002', 'delivery', NULL, 'Chị Mai', '0987654321', '123 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 104000, 'transfer', 'pending'),
('KC-1003', 'table', 'A3', 'Minh Tuấn', '0912345678', NULL, 155000, 'cash', 'completed');

INSERT INTO order_items (order_id, product_id, product_name, price, quantity, options, subtotal) VALUES
(1, 1, 'Cà Phê Sữa Đá Khang', 39000, 1, 'Đá 100%, Đường 70%', 39000),
(1, 3, 'Bạc Xỉu Sài Gòn Premium', 42000, 1, 'Ít đá, Ít ngọt', 42000),
(2, 7, 'Trà Đào Cam Sả Tươi', 49000, 2, 'Đá 100%', 98000),
(3, 4, 'Flat White Roasted', 55000, 1, 'Sữa tươi thanh trùng', 55000),
(3, 9, 'Croissant Bơ Pháp', 38000, 2, 'Hâm nóng', 76000);
