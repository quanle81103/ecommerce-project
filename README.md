# ecommerce-project

Nền tảng thương mại điện tử đa cửa hàng: backend Spring Boot + Lambda Node.js xử lý IPN VNPay.

## Cấu trúc

- `backend/ecommerce/` — Spring Boot 3.5 (Java 21): API chính.
- `frontend/` .

## Stack

- Spring Web / WebFlux / Data JPA / Security / Validation / Mail / Cache
- PostgreSQL, Redis
- JWT (jjwt 0.11.5), AWS S3 (lưu ảnh), AWS EC2 (server)
- MapStruct, ModelMapper, Lombok
- Tích hợp: VNPay (thanh toán), GHN (vận chuyển)

## Domain

Auth, User, Shop, Product, Category, Brand, Image, Cart, CartItem, Order, OrderItem, Payment, ShippingOrder.

## Chạy backend

Xem hướng dẫn deploy đầy đủ trên EC2 (SSH, tạo `.env`, build image, start/stop, redeploy): [DEPLOY.md](DEPLOY.md).
