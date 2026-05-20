# ecommerce-project

Nền tảng thương mại điện tử đa cửa hàng. Backend Spring Boot, deploy bằng Docker trên AWS EC2.

## Cấu trúc

- `backend/ecommerce/` — Spring Boot 3.5 (Java 21): API chính.
- `frontend/` — chưa khởi tạo.

## Stack

- Spring Web / WebFlux / Data JPA / Security / Validation / Mail / Cache
- PostgreSQL, Redis
- JWT (jjwt 0.11.5), AWS S3 (lưu ảnh)
- MapStruct, ModelMapper, Lombok
- Tích hợp: VNPay (thanh toán), GHN (vận chuyển)
- Deploy: Docker Compose trên AWS EC2

## Domain

Auth, User, Shop, Product, Category, Brand, Image, Cart, CartItem, Order, OrderItem, Payment, ShippingOrder.

## Chạy backend

Xem hướng dẫn deploy đầy đủ trên EC2 (SSH, tạo `.env`, build image, start/stop, redeploy): [DEPLOY.md](DEPLOY.md).
