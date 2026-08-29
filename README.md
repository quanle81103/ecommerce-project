# E-commerce Project

Nền tảng thương mại điện tử đa cửa hàng gồm website người mua, khu vực người bán, thanh toán, vận chuyển và chat thời gian thực.

## Demo

- Frontend: <https://ecommerce-project-weld-gamma.vercel.app>
- Backend API: <https://ecommerce-project-production-a7ad.up.railway.app/api/v1>

Tài khoản demo:

```text
Chủ shop: owner.home@demo.local / Demo@123
Người mua: buyer.one@demo.local / Demo@123
```

## Công nghệ

- Frontend: React 19, Vite, Tailwind CSS, Axios, STOMP WebSocket
- Backend: Java 21, Spring Boot, Spring Security, JWT, JPA
- Dữ liệu: PostgreSQL, Redis
- Tích hợp: AWS S3, GHN, VNPay sandbox, Gmail SMTP
- Deploy: Vercel và Railway

## Cấu trúc

```text
frontend/ecom/       React/Vite frontend
backend/ecommerce/   Spring Boot backend
```

## Deploy ngắn gọn

### 1. Backend trên Railway

1. Tạo PostgreSQL, Redis và service từ GitHub repository này.
2. Đặt Root Directory của backend là `/backend/ecommerce`.
3. Nối các biến `PG*` và `REDIS*` bằng Railway Reference Variables.
4. Điền các secret AWS, JWT, GHN, VNPay và Mail theo `backend/ecommerce/.env.example`.
5. Tạo Public Domain cho backend; nếu được hỏi port, chọn `8080`.
6. Chạy `backend/ecommerce/db/seed-demo.sql` một lần sau khi Hibernate tạo bảng.

Lệnh seed trên Windows PowerShell:

```powershell
Get-Content -Raw ".\backend\ecommerce\db\seed-demo.sql" | railway.cmd ssh --service Postgres -- sh -lc 'psql -v ON_ERROR_STOP=1 -U "$PGUSER" -d "$PGDATABASE"'
```

### 2. Frontend trên Vercel

```text
Framework Preset: Vite
Root Directory: frontend/ecom
Build Command: npm run build
Output Directory: dist
```

Tạo hai biến loại Config:

```env
VITE_API_BASE_URL=https://<railway-domain>/api/v1
VITE_WS_URL=wss://<railway-domain>/ws
```

Sau khi có domain Vercel, cập nhật Railway backend và redeploy:

```env
APP_CORS_ALLOWED_ORIGINS=https://<vercel-domain>,http://localhost:5173
```

Không đưa token hoặc secret vào biến `VITE_*` vì các biến này được gửi xuống trình duyệt.

## Chạy local

Backend cùng PostgreSQL và Redis:

```bash
cd backend/ecommerce
docker compose up --build
```

Frontend:

```bash
cd frontend/ecom
npm install
npm run dev
```
