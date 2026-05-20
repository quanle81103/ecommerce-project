# Vận hành backend trên EC2

Hướng dẫn thao tác vận hành ứng dụng đã deploy sẵn trên EC2: SSH, cấu hình `.env`, build, khởi động, dừng, xem log.

> **Trước khi bắt đầu**, bạn cần có:
> - File key SSH (`.pem`) được cấp.
> - Public IP của EC2.
> - Server đã cài sẵn Docker + Docker Compose, source code đã clone tại `~/ecommerce-project`.

## 1. SSH vào EC2

```bash
chmod 400 /path/to/your-key.pem      # chỉ lần đầu, set quyền cho key
ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

Đi tới thư mục backend:
```bash
cd ~/ecommerce-project/backend/ecommerce
```

Mọi lệnh dưới đây chạy trong thư mục này.

## 2. Cấu hình `.env`

File `.env` chứa các biến môi trường nhạy cảm (DB password, API keys, secrets). Docker Compose tự nạp khi start container.

Mở file:
```bash
nano .env
```

Template đầy đủ:
```dotenv
# AWS S3 (lưu ảnh sản phẩm)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# JWT
JWT_SECRETKEY=

# GHN (vận chuyển)
GHN_TOKEN=
GHN_BASE_URL=https://online-gateway.ghn.vn

# VNPay (thanh toán)
PAYMENT_VNPAY_TMNCODE=
PAYMENT_VNPAY_VERSION=2.1.0
PAYMENT_VNPAY_PAYURL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
PAYMENT_VNPAY_RETURNURL=http://<EC2_PUBLIC_IP>:8080/api/v1/payment/vnpay-callback
PAYMENT_VNPAY_COMMAND=pay
PAYMENT_VNPAY_ORDERTYPE=other
PAYMENT_VNPAY_HASHSECRET=

# Mail (Gmail app password)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=
SPRING_MAIL_PASSWORD=

# App
API_PREFIX=/api/v1
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

**Lưu ý**:
- Điền giá trị thật vào các field trống — lấy từ team lead / vault.
- `PAYMENT_VNPAY_RETURNURL` phải khớp public IP của EC2 hiện tại.
- Lưu file: `Ctrl+O` → `Enter` → `Ctrl+X`.

Set quyền chỉ owner đọc:
```bash
chmod 600 .env
```

> Sau khi sửa `.env`, **phải restart container** để giá trị mới có hiệu lực (xem mục 5).

## 3. Build image

Lần đầu, hoặc mỗi khi có code mới:

```bash
docker compose build --no-cache backend
```

- Lần đầu: ~5-10 phút (tải Maven dependencies).
- Lần sau: ~1-2 phút.
- `--no-cache` đảm bảo image build từ source mới nhất, bỏ qua layer cache.

Verify (cột `CREATED` phải là vài giây trước):
```bash
docker images | grep ecommerce
```

## 4. Khởi động ứng dụng

```bash
docker compose up -d
```

Lệnh này start cả 3 service: `backend`, `postgres`, `redis`. `-d` chạy nền.

Kiểm tra trạng thái:
```bash
docker compose ps
```

3 service phải `Up`. Đợi 30–60 giây để Spring Boot khởi động, sau đó tail log:
```bash
docker logs -f ecommerce-backend
```

App sẵn sàng khi thấy `Started EcommerceApplication in X seconds`. Ấn `Ctrl+C` thoát tail (container vẫn chạy).

Test:
```bash
curl http://<EC2_PUBLIC_IP>:8080/api/v1/products
```

## 5. Dừng / khởi động lại

**Tạm dừng** (giữ container + data):
```bash
docker compose stop
```

**Khởi động lại sau khi stop**:
```bash
docker compose start
```

**Restart nhanh** (ví dụ sau khi sửa `.env`):
```bash
docker compose restart backend
```

**Dừng hẳn + xoá container** (data DB vẫn còn trong volume):
```bash
docker compose down
```

> ⚠️ **Đừng dùng `docker compose down -v`** trừ khi cố ý xoá toàn bộ data DB.

## 6. Cập nhật code mới

```bash
cd ~/ecommerce-project
git pull

cd backend/ecommerce
docker compose down
docker compose build --no-cache backend
docker compose up -d
```

Đợi log `Started EcommerceApplication` là xong.

## 7. Xem log & debug

```bash
# Tail realtime
docker logs -f ecommerce-backend

# 200 dòng cuối
docker logs --tail 200 ecommerce-backend

# Log từ 10 phút trước
docker logs --since 10m ecommerce-backend

# Tìm error / exception
docker logs ecommerce-backend 2>&1 | grep -iE "error|exception"

# Log postgres / redis
docker logs ecommerce-postgres
docker logs ecommerce-redis
```

Vào shell container:
```bash
docker exec -it ecommerce-backend sh
```

Verify env vars đã vào process:
```bash
docker exec ecommerce-backend env | grep -E "GHN|VNPAY|AWS|JWT" | sort
```