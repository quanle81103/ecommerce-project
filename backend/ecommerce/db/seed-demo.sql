-- Demo catalog seed for a fresh or mostly-empty database.
-- Run after Spring Boot has started once with spring.jpa.hibernate.ddl-auto=update.
-- Demo login password for all accounts below: Demo@123
-- The stored value is a BCrypt hash, never a plaintext password.

START TRANSACTION;

INSERT INTO roles (role_status)
SELECT seed.role_status
FROM (VALUES
    ('ADMIN'),
    ('CUSTOMER'),
    ('SHOP_OWNER')
) AS seed(role_status)
WHERE NOT EXISTS (
    SELECT 1 FROM roles existing WHERE existing.role_status = seed.role_status
);

INSERT INTO users
    (first_name, last_name, email, place, password, phone, ward_code, ward_name,
     district_name, district_id, province_name)
VALUES
    ('Minh', 'Nguyễn', 'owner.tech@demo.local', 'Quận 1, TP. Hồ Chí Minh',
     '$2a$10$ilvag7gfbHrNiYmRHEiZX.Y.XvgDfon1WSUV3JJJz33ea9.Q8/pjC', '0901000001',
     NULL, 'Phường Bến Nghé', 'Quận 1', NULL, 'TP. Hồ Chí Minh'),
    ('Lan', 'Trần', 'owner.home@demo.local', 'Quận 3, TP. Hồ Chí Minh',
     '$2a$10$ilvag7gfbHrNiYmRHEiZX.Y.XvgDfon1WSUV3JJJz33ea9.Q8/pjC', '0901000002',
     NULL, 'Phường Võ Thị Sáu', 'Quận 3', NULL, 'TP. Hồ Chí Minh'),
    ('An', 'Lê', 'buyer.one@demo.local', 'Thành phố Thủ Đức, TP. Hồ Chí Minh',
     '$2a$10$ilvag7gfbHrNiYmRHEiZX.Y.XvgDfon1WSUV3JJJz33ea9.Q8/pjC', '0902000001',
     NULL, 'Phường Thảo Điền', 'Thành phố Thủ Đức', NULL, 'TP. Hồ Chí Minh'),
    ('Hà', 'Phạm', 'buyer.two@demo.local', 'Quận Bình Thạnh, TP. Hồ Chí Minh',
     '$2a$10$ilvag7gfbHrNiYmRHEiZX.Y.XvgDfon1WSUV3JJJz33ea9.Q8/pjC', '0902000002',
     NULL, 'Phường 25', 'Quận Bình Thạnh', NULL, 'TP. Hồ Chí Minh')
ON CONFLICT (email) DO NOTHING;

INSERT INTO cart (total_amount, user_id)
SELECT 0, seeded_user.id
FROM users seeded_user
WHERE seeded_user.email IN (
    'owner.tech@demo.local',
    'owner.home@demo.local',
    'buyer.one@demo.local',
    'buyer.two@demo.local'
)
AND NOT EXISTS (
    SELECT 1 FROM cart existing WHERE existing.user_id = seeded_user.id
);

INSERT INTO user_role (user_id, role_id)
SELECT seeded_user.id, role.id
FROM users seeded_user
JOIN roles role ON role.role_status = 'CUSTOMER'
WHERE seeded_user.email IN (
    'owner.tech@demo.local',
    'owner.home@demo.local',
    'buyer.one@demo.local',
    'buyer.two@demo.local'
)
AND NOT EXISTS (
    SELECT 1
    FROM user_role existing
    WHERE existing.user_id = seeded_user.id AND existing.role_id = role.id
);

INSERT INTO user_role (user_id, role_id)
SELECT seeded_user.id, role.id
FROM users seeded_user
JOIN roles role ON role.role_status = 'SHOP_OWNER'
WHERE seeded_user.email IN ('owner.tech@demo.local', 'owner.home@demo.local')
AND NOT EXISTS (
    SELECT 1
    FROM user_role existing
    WHERE existing.user_id = seeded_user.id AND existing.role_id = role.id
);

INSERT INTO shop
    (description, logo_url, user_id, ghn_token, ghn_shop_id, ghn_connected,
     from_name, from_phone, from_address, from_ward_name, from_district_name, from_province_name)
SELECT seed.description,
       NULL,
       owner.id,
       NULL,
       NULL,
       false,
       seed.shop_name,
       seed.phone,
       seed.address,
       seed.ward_name,
       seed.district_name,
       seed.province_name
FROM (VALUES
    ('Tech Corner', 'Điện thoại, laptop và phụ kiện công nghệ chính hãng.', '0901000001',
     '12 Nguyễn Huệ', 'Phường Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 'owner.tech@demo.local'),
    ('Home & More', 'Thiết bị gia dụng và phụ kiện tiện ích cho gia đình.', '0901000002',
     '88 Võ Văn Tần', 'Phường Võ Thị Sáu', 'Quận 3', 'TP. Hồ Chí Minh', 'owner.home@demo.local')
) AS seed(shop_name, description, phone, address, ward_name, district_name, province_name, owner_email)
JOIN users owner ON owner.email = seed.owner_email
WHERE NOT EXISTS (
    SELECT 1 FROM shop existing WHERE existing.user_id = owner.id
);

INSERT INTO category (name)
SELECT name
FROM (VALUES
    ('Điện thoại'),
    ('Laptop'),
    ('Phụ kiện'),
    ('Thiết bị gia dụng')
) AS seed(name)
WHERE NOT EXISTS (
    SELECT 1 FROM category existing WHERE lower(existing.name) = lower(seed.name)
);

INSERT INTO brand (name, description)
SELECT seed.name, seed.description
FROM (VALUES
    ('Apple', 'Thiết bị công nghệ Apple'),
    ('Samsung', 'Điện thoại và thiết bị Samsung'),
    ('Anker', 'Phụ kiện sạc và âm thanh'),
    ('Logitech', 'Phụ kiện máy tính và gaming')
) AS seed(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM brand existing WHERE lower(existing.name) = lower(seed.name)
);

INSERT INTO product
    (name, price, inventory, description, weight, length, height, width, brand_id, category_id, shop_id)
SELECT seed.name,
       seed.price,
       seed.inventory,
       seed.description,
       seed.weight,
       seed.length,
       seed.height,
       seed.width,
       brand.id,
       category.id,
       shop.id
FROM (VALUES
    ('iPhone 15 128GB', 18990000::numeric, 18, 'Điện thoại hiệu năng cao, thiết kế gọn nhẹ.', 500, 18, 8, 10, 'Apple', 'Điện thoại', 'owner.tech@demo.local'),
    ('Galaxy S24 256GB', 16990000::numeric, 15, 'Màn hình sáng, camera đa năng, hỗ trợ 5G.', 500, 18, 8, 9, 'Samsung', 'Điện thoại', 'owner.tech@demo.local'),
    ('MacBook Air M3 13 inch', 25990000::numeric, 8, 'Laptop mỏng nhẹ cho học tập và công việc.', 1800, 31, 2, 22, 'Apple', 'Laptop', 'owner.tech@demo.local'),
    ('Galaxy Book4 Pro', 28990000::numeric, 6, 'Laptop màn hình sắc nét, pin lâu.', 1700, 31, 2, 22, 'Samsung', 'Laptop', 'owner.tech@demo.local'),
    ('Sạc nhanh Anker 65W', 1190000::numeric, 30, 'Củ sạc USB-C nhỏ gọn, công suất 65W.', 250, 8, 4, 5, 'Anker', 'Phụ kiện', 'owner.tech@demo.local'),
    ('Tai nghe Anker Soundcore', 1490000::numeric, 24, 'Tai nghe không dây chống ồn cho nhu cầu hằng ngày.', 350, 10, 8, 10, 'Anker', 'Phụ kiện', 'owner.tech@demo.local'),
    ('Chuột Logitech MX Master 3S', 2190000::numeric, 20, 'Chuột công thái học, kết nối nhiều thiết bị.', 500, 13, 5, 8, 'Logitech', 'Phụ kiện', 'owner.tech@demo.local'),
    ('Bàn phím Logitech K380', 890000::numeric, 26, 'Bàn phím Bluetooth gọn nhẹ, phù hợp văn phòng.', 450, 28, 3, 13, 'Logitech', 'Phụ kiện', 'owner.tech@demo.local'),
    ('Máy lọc không khí mini', 2290000::numeric, 10, 'Thiết bị lọc không khí nhỏ gọn cho phòng ngủ.', 2200, 25, 40, 25, 'Samsung', 'Thiết bị gia dụng', 'owner.home@demo.local'),
    ('Robot hút bụi thông minh', 6490000::numeric, 7, 'Robot tự động làm sạch sàn nhà theo lịch.', 3500, 35, 10, 35, 'Samsung', 'Thiết bị gia dụng', 'owner.home@demo.local'),
    ('iPad Air 11 inch', 16990000::numeric, 12, 'Máy tính bảng đa năng cho học tập và giải trí.', 700, 25, 1, 18, 'Apple', 'Điện thoại', 'owner.tech@demo.local'),
    ('Webcam Logitech C920', 1790000::numeric, 16, 'Webcam Full HD cho họp trực tuyến và học online.', 250, 10, 5, 4, 'Logitech', 'Phụ kiện', 'owner.tech@demo.local')
) AS seed(name, price, inventory, description, weight, length, height, width, brand_name, category_name, owner_email)
JOIN brand ON lower(brand.name) = lower(seed.brand_name)
JOIN category ON lower(category.name) = lower(seed.category_name)
JOIN users owner ON owner.email = seed.owner_email
JOIN shop ON shop.user_id = owner.id
WHERE NOT EXISTS (
    SELECT 1 FROM product existing WHERE lower(existing.name) = lower(seed.name)
);

-- Repair product ownership if an earlier version of this seed inserted products without a shop.
UPDATE product
SET shop_id = shop.id
FROM shop
JOIN users owner ON owner.id = shop.user_id
WHERE product.shop_id IS NULL
  AND (
      (owner.email = 'owner.home@demo.local' AND product.name IN (
          'Máy lọc không khí mini', 'Robot hút bụi thông minh'
      ))
      OR
      (owner.email = 'owner.tech@demo.local' AND product.name IN (
          'iPhone 15 128GB', 'Galaxy S24 256GB', 'MacBook Air M3 13 inch',
          'Galaxy Book4 Pro', 'Sạc nhanh Anker 65W', 'Tai nghe Anker Soundcore',
          'Chuột Logitech MX Master 3S', 'Bàn phím Logitech K380',
          'iPad Air 11 inch', 'Webcam Logitech C920'
      ))
  );

INSERT INTO orders
    (order_date, total_amount, order_status, shop_id, user_id, payment_id, shipping_fee,
     province_id, district_id, ward_code, receiver_name, receiver_phone, place)
SELECT CURRENT_TIMESTAMP - seed.age,
       seed.total_amount,
       seed.order_status,
       shop.id,
       buyer.id,
       NULL,
       seed.shipping_fee,
       NULL,
       NULL,
       NULL,
       seed.receiver_name,
       seed.receiver_phone,
       seed.place
FROM (VALUES
    (INTERVAL '45 days', 20180000::numeric, 'DELIVERED', 30000, 'An Lê', '0902000001',
     '15 Xuân Thủy, Thành phố Thủ Đức', 'buyer.one@demo.local', 'owner.tech@demo.local'),
    (INTERVAL '30 days', 5270000::numeric, 'DELIVERED', 25000, 'Hà Phạm', '0902000002',
     '92 Nguyễn Gia Trí, Quận Bình Thạnh', 'buyer.two@demo.local', 'owner.tech@demo.local'),
    (INTERVAL '20 days', 2290000::numeric, 'DELIVERED', 35000, 'An Lê', '0902000001',
     '15 Xuân Thủy, Thành phố Thủ Đức', 'buyer.one@demo.local', 'owner.home@demo.local'),
    (INTERVAL '5 days', 6490000::numeric, 'SHIPPING', 40000, 'Hà Phạm', '0902000002',
     '92 Nguyễn Gia Trí, Quận Bình Thạnh', 'buyer.two@demo.local', 'owner.home@demo.local'),
    (INTERVAL '2 days', 16990000::numeric, 'PROCESSING', 30000, 'An Lê', '0902000001',
     '15 Xuân Thủy, Thành phố Thủ Đức', 'buyer.one@demo.local', 'owner.tech@demo.local'),
    (INTERVAL '1 day', 1790000::numeric, 'CANCELLED', 25000, 'Hà Phạm', '0902000002',
     '92 Nguyễn Gia Trí, Quận Bình Thạnh', 'buyer.two@demo.local', 'owner.tech@demo.local')
) AS seed(age, total_amount, order_status, shipping_fee, receiver_name, receiver_phone,
          place, buyer_email, owner_email)
JOIN users buyer ON buyer.email = seed.buyer_email
JOIN users owner ON owner.email = seed.owner_email
JOIN shop ON shop.user_id = owner.id
WHERE NOT EXISTS (
    SELECT 1
    FROM orders existing
    WHERE existing.user_id = buyer.id
      AND existing.shop_id = shop.id
      AND existing.total_amount = seed.total_amount
      AND existing.order_status = seed.order_status
      AND existing.receiver_phone = seed.receiver_phone
);

INSERT INTO order_item (quantity, unit_price, weight, order_id, product_id)
SELECT seed.quantity,
       product.price,
       product.weight,
       seeded_order.id,
       product.id
FROM (VALUES
    (20180000::numeric, 'DELIVERED', 'buyer.one@demo.local', 'owner.tech@demo.local', 'iPhone 15 128GB', 1),
    (20180000::numeric, 'DELIVERED', 'buyer.one@demo.local', 'owner.tech@demo.local', 'Sạc nhanh Anker 65W', 1),
    (5270000::numeric, 'DELIVERED', 'buyer.two@demo.local', 'owner.tech@demo.local', 'Chuột Logitech MX Master 3S', 2),
    (5270000::numeric, 'DELIVERED', 'buyer.two@demo.local', 'owner.tech@demo.local', 'Bàn phím Logitech K380', 1),
    (2290000::numeric, 'DELIVERED', 'buyer.one@demo.local', 'owner.home@demo.local', 'Máy lọc không khí mini', 1),
    (6490000::numeric, 'SHIPPING', 'buyer.two@demo.local', 'owner.home@demo.local', 'Robot hút bụi thông minh', 1),
    (16990000::numeric, 'PROCESSING', 'buyer.one@demo.local', 'owner.tech@demo.local', 'Galaxy S24 256GB', 1),
    (1790000::numeric, 'CANCELLED', 'buyer.two@demo.local', 'owner.tech@demo.local', 'Webcam Logitech C920', 1)
) AS seed(order_total, order_status, buyer_email, owner_email, product_name, quantity)
JOIN users buyer ON buyer.email = seed.buyer_email
JOIN users owner ON owner.email = seed.owner_email
JOIN shop ON shop.user_id = owner.id
JOIN orders seeded_order
  ON seeded_order.user_id = buyer.id
 AND seeded_order.shop_id = shop.id
 AND seeded_order.total_amount = seed.order_total
 AND seeded_order.order_status = seed.order_status
JOIN product ON product.name = seed.product_name AND product.shop_id = shop.id
WHERE NOT EXISTS (
    SELECT 1
    FROM order_item existing
    WHERE existing.order_id = seeded_order.id AND existing.product_id = product.id
);

COMMIT;
